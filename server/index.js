import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const users = [
    {
        email: "student@villavredestein.com",
        password: "$2b$10$Qwzgk8S55IrjVSw4P7gcreQagUVfK/FSqBr8q1jVs905dtn4PioK6" // welkomenvoeljethuis
    },
    {
        email: "manon@villavredestein.com",
        password: "$2a$10$P5NsyNMB02LDXLcv.yx5AuRMYJ3jxV2OnkSghzzDChePgnRDuR7mS" // veiligheidbovenalles
    }
];

function generateAccessToken(user) {
    return jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

function generateRefreshToken(user) {
    return jwt.sign({ email: user.email }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Token ontbreekt" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token ongeldig of verlopen" });
        req.user = user;
        next();
    });
}

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "Login mislukt" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/api/refresh-token",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ token: accessToken });
});

app.post("/api/refresh-token", (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.REFRESH_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        const accessToken = generateAccessToken({ email: user.email });
        res.json({ token: accessToken });
    });
});

app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({
        message: "Welkom op de beveiligde route",
        user: req.user.email
    });
});

app.post("/api/logout", (req, res) => {
    res.clearCookie("refreshToken", { path: "/api/refresh-token" });
    res.json({ message: "Uitgelogd" });
});

app.listen(PORT, () => {
    console.log(`✅ Server draait op http://localhost:${PORT}`);
});