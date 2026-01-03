import { Comment } from "../models/Comment.js";
import { Article } from "../models/Article.js";

// CREATE
export function createComment(req, res) {
    const { articleId } = req.params;
    const { contenu } = req.body;

    Article.findById(articleId)
        .then(function (article) {
            if (!article || article.statut !== "publié") {
                return res.status(400).json({ error: "Article non publié ou introuvable" });
            }

            return Comment.create({
                contenu,
                auteur: req.user._id,
                article: articleId,
            });
        })
        .then(function (comment) {
            if (comment) return res.status(201).json(comment);
        })
        .catch(function (err) {
            return res.status(500).json({ error: err.message });
        });
}

// READ
export function getArticleComments(req, res) {
    const { articleId } = req.params;

    Comment.find({ article: articleId })
        .populate("auteur", "nom email")
        .sort({ createdAt: -1 })
        .then(function (comments) {
            return res.json(comments);
        })
        .catch(function (err) {
            return res.status(500).json({ error: err.message });
        });
}

// UPDATE
export function updateComment(req, res) {
    const { id } = req.params;
    const { contenu } = req.body;

    Comment.findById(id)
        .then(function (comment) {
            if (!comment) return res.status(404).json({ error: "Commentaire introuvable" });
            if (comment.auteur.toString() !== req.user.userId) return res.status(403).json({ error: "Non autorisé" });

            comment.contenu = contenu ?? comment.contenu;
            return comment.save();
        })
        .then(function (saved) {
            if (saved) return res.json(saved);
        })
        .catch(function (err) {
            return res.status(500).json({ error: err.message });
        });
}

// DELETE
export function deleteComment(req, res) {
    const { id } = req.params;

    Comment.findById(id)
        .then(function (comment) {
            if (!comment) return res.status(404).json({ error: "Commentaire introuvable" });
            if (comment.auteur.toString() !== req.user.userId) return res.status(403).json({ error: "Non autorisé" });

            return comment.deleteOne();
        })
        .then(function (deleted) {
            if (deleted) return res.json({});
        })
        .catch(function (err) {
            return res.status(500).json({ error: err.message });
        });
}