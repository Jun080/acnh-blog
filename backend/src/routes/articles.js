import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import { getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle, getMyArticles, publierArticle, brouillonArticle } from "../controllers/articleController.js";
import { getArticleComments, createComment } from "../controllers/commentController.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", getAllArticles);
router.get("/my-articles", protect, getMyArticles);
router.get("/:id", getArticleById);

router.get("/:articleId/comments", getArticleComments);
router.post("/:articleId/comments", protect, createComment);

router.use(protect);

router.post("/", upload.single("image"), createArticle);
router.put("/:id", upload.single("image"), updateArticle);
router.patch("/:id/publier", publierArticle);
router.patch("/:id/brouillon", brouillonArticle);
router.delete("/:id", deleteArticle);

export default router;
