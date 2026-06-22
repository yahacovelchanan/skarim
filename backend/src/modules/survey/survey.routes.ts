import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createSurveyController,
  updateSurveyController,
  getSurveyController,
  getSurveyBySlugController,
  getMySurveysController,
  deleteSurveyController,
} from "./survey.controller";

const router = Router();

/* CREATE SURVEY */
router.post(
  "/",
  authMiddleware,
  createSurveyController
);

/* GET MY SURVEYS */
router.get(
  "/my",
  authMiddleware,
  getMySurveysController
);

/* PUBLIC SURVEY BY SLUG */
router.get(
  "/slug/:slug",
  getSurveyBySlugController
);

/* GET SURVEY BY ID */
router.get(
  "/:id",
  authMiddleware,
  getSurveyController
);

/* UPDATE SURVEY */
router.patch(
  "/:id",
  authMiddleware,
  updateSurveyController
);

/* DELETE SURVEY */
router.delete(
  "/:id",
  authMiddleware,
  deleteSurveyController
);

export default router;