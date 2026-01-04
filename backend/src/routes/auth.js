import express from "express";
import { register, login, getProfile, updateProfile, updatePassword } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.use(protect);

router.get("/me", getProfile);
router.put("/me", updateProfile);
router.put("/me/password", updatePassword);

export default router;
