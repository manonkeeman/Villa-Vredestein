const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("🎉 Backend draait! Villa Vredestein API staat aan.");
});

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    console.log("🟢 Login poging:", email, password);

    if (email === "student@villavredestein.com" && password === "welkomenvoeljethuis") {
        const token = "dummyToken123";
        const user = { email };
        return res.json({ accessToken: token, user });
    }

    console.warn("🔴 Ongeldige poging:", email, password);
    return res.status(401).json({ message: "Ongeldige inloggegevens" });
});

    if (email === "student@villavredestein.com" && password === "welkomenvoeljethuis") {
        const token = "dummyToken123";

        const user = {
            id: 1,
            name: "Student",
            email,
            role: "student"
        };

        return res.json({ accessToken: token, user });
    }

    return res.status(401).json({ message: "Ongeldige inloggegevens" });
});

app.post("/api/refresh", (req, res) => {
    const newToken = "refreshedToken456";
    const user = {
        id: 1,
        name: "Student",
        email: "student@villavredestein.com",
        role: "student"
    };

    res.json({ accessToken: newToken, user });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Backend draait op http://localhost:${PORT}`);
});