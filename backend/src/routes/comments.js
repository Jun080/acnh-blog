import express from "express";
import { protect } from "../middleware/auth.js";
import { updateComment, deleteComment } from "../controllers/commentController.js";

const router = express.Router();

router.use(protect);

router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;
