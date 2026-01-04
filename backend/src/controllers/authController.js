import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Article } from "../models/Article.js";
import { Comment } from "../models/Comment.js";

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

        const token = jwt.sign(
            { userId: user._id, email: user.email, nom: user.nom },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

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

export const getProfile = async (req, res) => {
    try {
        const user = req.user;

        const articleOwnerFilter = [{ auteurId: user._id }];
        if (user.nom) {
            articleOwnerFilter.push({ auteur: user.nom });
        }

        const [articleCount, commentCount] = await Promise.all([
            Article.countDocuments({ $or: articleOwnerFilter }),
            Comment.countDocuments({ auteur: user._id }),
        ]);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                nom: user.nom,
                email: user.email,
                createdAt: user.createdAt,
            },
            stats: {
                articles: articleCount,
                commentaires: commentCount,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { nom, email } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
        }

        const previousNom = user.nom;

        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
                return res.status(400).json({ success: false, message: "Cet email est déjà utilisé" });
            }
        }

        if (nom) user.nom = nom;
        if (email) user.email = email;

        await user.save();

        const articleFilter = [{ auteurId: user._id }];
        if (previousNom) {
            articleFilter.push({ auteur: previousNom });
        }
        await Article.updateMany({ $or: articleFilter }, { auteur: user.nom });

        res.status(200).json({
            success: true,
            message: "Profil mis à jour",
            user: { id: user._id, nom: user.nom, email: user.email, createdAt: user.createdAt },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Champs manquants" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Le mot de passe doit contenir au moins 6 caractères" });
        }

        const user = await User.findById(req.user._id).select("+password");
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
        }

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: "Mot de passe actuel incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        res.status(200).json({ success: true, message: "Mot de passe mis à jour" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};
