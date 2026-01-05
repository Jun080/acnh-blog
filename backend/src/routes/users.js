import express from "express";
import { getPublicProfileById } from "../controllers/authController.js";

const router = express.Router();

router.get("/:id/public", getPublicProfileById);

export default router;
