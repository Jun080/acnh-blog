import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        contenu: {
            type: String,
            required: true,
            minlength: 5,
            trim: true,
        },
        auteur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        article: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Article",
            required: true,
        },
    },
    { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);