import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const register = async (req, res) => {
    try {
        const { nom, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Cet email est déjà utilisé",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({ nom, email, password: hashedPassword });

        res.status(201).json({
            success: true,
            message: "Utilisateur créé avec succès",
            user: {
                id: user._id,
                nom: user.nom,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email incorrect",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Mot de passe incorrect",
            });
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || "votre_secret_jwt", { expiresIn: "24h" });

        res.status(200).json({
            success: true,
            message: "Connexion réussie",
            token,
            user: {
                id: user._id,
                nom: user.nom,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: error.message,
        });
    }
};
