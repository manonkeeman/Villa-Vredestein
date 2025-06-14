import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const users = [
    {
        email: "student@villavredestein.com",
        password: bcrypt.hashSync("welkomenvoeljethuis", 10),
    },
];

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user) return res.status(401).json({ message: "Ongeldige login" });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ message: "Wachtwoord fout" });

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    res.json({ token });
});

app.listen(PORT, () => {
    console.log(`✅ Server draait op http://localhost:${PORT}`);
});