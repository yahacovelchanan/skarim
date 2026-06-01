import { Router } from "express";
import { submitResponse , getSurveyResponses } from "./response.controller";

const router = Router();

router.post("/", submitResponse);
router.get("/:surveyId",getSurveyResponses);

export default router;