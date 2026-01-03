import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/database.js";
import articleRouter from "./routes/articles.js";
import authRouter from "./routes/auth.js";
import commentRouter from "./routes/comments.js";

dotenv.config();

const app = express();

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(
    cors({
        origin: "http://localhost:3001",
        credentials: true,
    })
);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Trop de requêtes, réessayez plus tard",
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Trop de tentatives de connexion, réessayez plus tard",
});

app.use(limiter);

app.use(express.json({ limit: "10kb" }));
app.use((req, res, next) => {
    if (req.body) {
        req.body = mongoSanitize.sanitize(req.body);
    }
    next();
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({
        message: "Bienvenue sur mon API",
        version: "1.0.0",
        status: "le serveur fonctionne à merveille",
    });
});

app.use("/uploads", express.static("uploads"));

app.use("/api/articles", articleRouter);
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/comments", commentRouter);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Erreur serveur";
    return res.status(status).json({ error: message });
});

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
