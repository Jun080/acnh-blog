import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
            required: [true, "Le nom est requis"],
            trim: true,
            minlength: [2, "Le nom doit contenir au moins 2 caractères"],
            maxlength: [50, "Le nom ne peut dépasser 50 caractères"],
        },
        email: {
            type: String,
            required: [true, "L'email est requis"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Email invalide"],
        },
        password: {
            type: String,
            required: [true, "Le mot de passe est requis"],
            minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model("User", userSchema);
