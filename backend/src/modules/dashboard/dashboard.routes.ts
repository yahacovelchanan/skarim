import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getDashboard } from "./dashboard.controller";

const router = Router();

router.get("/my", authMiddleware, getDashboard);

export default router;