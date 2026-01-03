import express from "express";
// const express = require('express')
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/database.js";
import articleRouter from "./routes/articles.js";
import authRouter from "./routes/auth.js";
import commentRouter from "./routes/comments.js";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: "http://localhost:3001",
        credentials: true,
    })
);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({
        message: "Bienvenue sur mon API",
        version: "1.0.0",
        status: "le serveur fonctionne à merveille",
    });
});

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/articles", articleRouter);
app.use("/api/auth", authRouter);
app.use("/api/comments", commentRouter);

async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Serveur démarré sur le port ${PORT}`);
        });
    } catch (error) {
        console.error("Erreur au démarrage du serveur : ", error);
        process.exit(1);
    }
}

startServer();
