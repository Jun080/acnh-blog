import { Article } from "../models/Article.js";

// CREATE
async function createArticle(req, res) {
    try {
        const { titre, contenu, auteur, categorie } = req.body;

        const article = new Article({
            titre,
            contenu,
            auteur,
            categorie,
        });

        const articleSauvegarde = await article.save();

        res.status(201).json({
            success: true,
            message: "Article créé avec succès",
            data: articleSauvegarde,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création de l'article",
            error: error.message,
        });
    }
}

// READ
function getAllArticles(req, res) {
    Article.find()
        .limit(100)
        .then(function (list) {
            return res.json(list);
        })
        .catch(function (err) {
            return res.json({ error: err.message });
        });
}

function getArticleById(req, res) {
    Article.findById(req.params.id)
        .then(function (art) {
            if (!art) return res.json({ error: "Not found" });
            return res.json(art);
        })
        .catch(function (err) {
            return res.json({ error: err.message });
        });
}

// UPDATE
function updateArticle(req, res) {
    Article.findByIdAndUpdate(req.params.id, req.body || {}, { new: true })
        .then(function (updated) {
            if (!updated) return res.json({ error: "Not found" });
            return res.json(updated);
        })
        .catch(function (err) {
            return res.json({ error: err.message });
        });
}

// DELETE
function deleteArticle(req, res) {
    Article.findByIdAndDelete(req.params.id)
        .then(function () {
            return res.json({});
        })
        .catch(function (err) {
            return res.json({ error: err.message });
        });
}

export { createArticle, getAllArticles, getArticleById, updateArticle, deleteArticle };
