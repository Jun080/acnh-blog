import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import { getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle } from "../controllers/articleController.js";

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
router.get("/:id", getArticleById);

router.use(protect);

router.post("/", upload.single("image"), createArticle);
router.put("/:id", updateArticle);
router.delete("/:id", deleteArticle);

export default router;
