import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { normalizeId } from "../utils/normalizeId";
import { validateSurveyData } from "./survey.validation";
import {
  getSurvey,
  updateSurvey,
  createSurvey,
  getSurveyBySlug,
  getMySurveys,
  deleteSurvey,
} from "./survey.service";

export const getSurveyController = async (
  req: AuthRequest,
  res: Response
) => {
  const id = normalizeId(req.params.id);

  if (!id) {
    return res.status(400).json({
      error: "Invalid id",
    });
  }

  const survey = await getSurvey(id);

  res.json(survey);
};

export const updateSurveyController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = normalizeId(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "Invalid id",
      });
    }

    const userId = req.user?.userId;

if (!userId) {
  return res.status(401).json({
    error: "Unauthorized",
  });
}

const validationError =
  validateSurveyData(req.body);

if (validationError) {
  return res.status(400).json({
    error: validationError,
  });
}

const survey = await updateSurvey(
  id,
  userId,
  req.body
);

    if (!survey) {
      return res.status(404).json({
        error: "Survey not found",
      });
    }

    res.json(survey);
  } catch {
    res.status(500).json({
      error: "Failed to update survey",
    });
  }
};

export const deleteSurveyController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = normalizeId(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "Invalid id",
      });
    }

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const deletedSurvey = await deleteSurvey(
      id,
      userId
    );

    if (!deletedSurvey) {
      return res.status(404).json({
        error: "Survey not found",
      });
    }

    res.json({
      success: true,
    });
  } catch {
    res.status(500).json({
      error: "Failed to delete survey",
    });
  }
};

export const createSurveyController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    const { title, description } = req.body;
    const validationError =
      validateSurveyData({
        title,
      });

    if (validationError) {
      return res.status(400).json({
       error: validationError,
      });
    }

    const survey = await createSurvey(
      title,
      description,
      userId!
    );

    res.json(survey);
  } catch {
    res.status(500).json({
      error: "Failed to create survey",
    });
  }
};

export const getSurveyBySlugController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const slug = Array.isArray(req.params.slug)
      ? req.params.slug[0]
      : req.params.slug;

    const survey = await getSurveyBySlug(slug);

    if (!survey) {
      return res.status(404).json({
        error: "Survey not found",
      });
    }

    res.json(survey);
  } catch {
    res.status(500).json({
      error: "Failed to fetch survey",
    });
  }
};

export const getMySurveysController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const surveys = await getMySurveys(userId);

    res.json(surveys);
  } catch {
    res.status(500).json({
      error: "Failed to fetch surveys",
    });
  }
};