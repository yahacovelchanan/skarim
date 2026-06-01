import {
  Router,
} from "express";

import {
  authMiddleware,
} from "../middleware/auth.middleware";

import {
  createSurveyController,
  updateSurveyController,
  getSurveyController,
  getSurveyBySlugController,
  getMySurveysController
} from "./survey.controller";

const router =
  Router();

/* CREATE SURVEY */
router.post(
  "/",
  authMiddleware,
  createSurveyController
);

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

export default router;