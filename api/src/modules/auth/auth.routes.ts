import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { requireAuth } from "../../middleware/auth.js";

const router = Router();
const authController = new AuthController();

// GET /auth/me - Get current user
router.get("/me", requireAuth, (req, res) =>
  authController.getCurrentUser(req, res)
);

export default router;
