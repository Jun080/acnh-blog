import { Article } from "../models/Article.js";

// CREATE
async function createArticle(req, res) {
    try {
        const { titre, contenu, categorie, statut } = req.body;

        const auteur = req.user.nom;
        const auteurId = req.user.userId;

        let imagePath = null;
        if (req.file) {
            imagePath = req.file.filename;
        }

        const article = new Article({
            titre,
            contenu,
            auteur,
            auteurId,
            categorie: categorie,
            statut: statut || "publié",
            image: imagePath,
        });

        const articleSauvegarde = await article.save();

        res.status(201).json({
            success: true,
            message: "Article créé avec succès",
            article: articleSauvegarde,
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
    const {
        page = 1,
        limit = 10,
        sort = "-createdAt",
        categorie,
        statut,
        search,
    } = req.query;

    const query = {};
    if (categorie) query.categorie = categorie;
    if (statut) query.statut = statut === "publie" ? "publié" : statut;
    if (search) {
        query.$or = [
            { titre: { $regex: search, $options: "i" } },
            { contenu: { $regex: search, $options: "i" } },
        ];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    Promise.all([
        Article.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limitNum),
        Article.countDocuments(query),
    ])
        .then(function ([list, total]) {
            const articlesWithIcon = list.map(article => ({
                ...article.toObject(),
                icon: Article.getCategorieIcon(article.categorie)
            }));

            return res.json({
                items: articlesWithIcon,
                total,
                page: pageNum,
                limit: limitNum,
                pageCount: Math.ceil(total / limitNum) || 1,
            });
        })
        .catch(function (err) {
            return res.status(500).json({ error: err.message });
        });
}

function getArticleById(req, res) {
    Article.findById(req.params.id)
        .then(function (art) {
            if (!art) return res.json({ error: "Not found" });
            const articleWithIcon = {
                ...art.toObject(),
                icon: Article.getCategorieIcon(art.categorie)
            };
            return res.json(articleWithIcon);
        })
        .catch(function (err) {
            return res.json({ error: err.message });
        });
}

// UPDATE
function updateArticle(req, res) {
    const updates = { ...req.body };

    if (req.file) {
        updates.image = req.file.filename;
    }

    Article.findByIdAndUpdate(req.params.id, updates, { new: true })
        .then(function (updated) {
            return res.json(updated);
        })
        .catch(function (err) {
            return res.status(500).json({ error: err.message });
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

// GET MY ARTICLES
function getMyArticles(req, res) {
    // pour avoir les articles via req.user.userId ET via req.user.nom
    const criteria = [{ auteurId: req.user.userId }];
    if (req.user.nom) {
        criteria.push({ auteur: req.user.nom });
    }

    Article.find({ $or: criteria })
        .limit(100)
        .then(function (list) {
            const articlesWithIcon = list.map(article => ({
                ...article.toObject(),
                icon: Article.getCategorieIcon(article.categorie)
            }));
            return res.json(articlesWithIcon);
        })
        .catch(function (err) {
            return res.json({ error: err.message });
        });
}

// PUBLISH
function publierArticle(req, res) {
    Article.findByIdAndUpdate(req.params.id, { statut: "publié" }, { new: true })
        .then(function (updated) {
            return res.json(updated);
        })
        .catch(function (err) {
            return res.status(500).json({ error: err.message });
        });
}

// SET DRAFT
function brouillonArticle(req, res) {
    Article.findByIdAndUpdate(req.params.id, { statut: "brouillon" }, { new: true })
        .then(function (updated) {
            return res.json(updated);
        })
        .catch(function (err) {
            return res.status(500).json({ error: err.message });
        });
}

export { createArticle, getAllArticles, getArticleById, updateArticle, deleteArticle, getMyArticles, publierArticle, brouillonArticle };
