import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS-configuratie voor frontend op localhost:5173
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// 🔐 Gebruikerslijst (bcrypt wachtwoorden)
const users = [
    {
        email: "student@villavredestein.com",
        password: "$2b$10$Qwzgk8S55IrjVSw4P7gcreQagUVfK/FSqBr8q1jVs905dtn4PioK6", // welkomenvoeljethuis
    },
    {
        email: "manon@villavredestein.com",
        password: "$2a$10$P5NsyNMB02LDXLcv.yx5AuRMYJ3jxV2OnkSghzzDChePgnRDuR7mS", // veiligheidbovenalles
    },
];

// 🔐 JWT helpers
const generateAccessToken = (user) =>
    jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

const generateRefreshToken = (user) =>
    jwt.sign({ email: user.email }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

// ✅ Middleware: check access-token
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token ontbreekt" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.warn("❌ Token ongeldig:", err.message);
            return res.status(403).json({ message: "Token ongeldig of verlopen" });
        }
        req.user = user;
        next();
    });
}

// ✅ Login route
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    console.log("🔐 Inlogpoging:", email);

    const user = users.find((u) => u.email === email);
    if (!user) return res.status(401).json({ message: "Gebruiker niet gevonden" });

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Wachtwoord onjuist" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // Zet op true bij productie
        sameSite: "Strict",
        path: "/api/refresh-token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ token: accessToken });
});

// ✅ Token vernieuwen
app.post("/api/refresh-token", (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "Refresh-token ontbreekt" });

    jwt.verify(token, process.env.REFRESH_SECRET, (err, user) => {
        if (err) {
            console.warn("🔁 Refresh-token ongeldig:", err.message);
            return res.status(403).json({ message: "Refresh-token ongeldig" });
        }

        const newAccessToken = generateAccessToken({ email: user.email });
        res.json({ token: newAccessToken });
    });
});

// ✅ Beveiligde route
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({
        message: "Welkom op de beveiligde route",
        user: req.user.email,
    });
});

// ✅ Logout
app.post("/api/logout", (req, res) => {
    res.clearCookie("refreshToken", { path: "/api/refresh-token" });
    res.json({ message: "Uitgelogd" });
});

// ✅ Start de server
app.listen(PORT, () => {
    console.log(`🚀 Server draait op http://localhost:${PORT}`);
});