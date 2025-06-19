import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/protected", (req, res) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Toegang geweigerd" });
    }
    return res.status(200).json({ message: "Beveiligde data opgehaald", user: "student" });
});

app.get("/", (req, res) => {
    res.send("Villa Vredestein backend draait ✅");
});

app.listen(PORT, () => {
    console.log(`🚀 Server draait op http://localhost:${PORT}`);
});