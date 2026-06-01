import {AuthRequest} from "../middleware/auth.middleware";
import { getSurvey, updateSurvey,createSurvey} from "./survey.service";
import { Response } from "express";
import { normalizeId } from "../utils/normalizeId";
import { getSurveyBySlug } from "./survey.service";
import {
  getMySurveys,
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

export const updateSurveyController =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    const id = normalizeId(req.params.id);

if (!id) {
  return res.status(400).json({
    error: "Invalid id",
  });
}

const survey = await updateSurvey(
  id,
  req.body
);

    res.json(survey);
  };

export const createSurveyController =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const userId =
        req.user?.userId;

      const {
        title,
        description,
      } = req.body;

      const survey =
        await createSurvey(
          title,
          description,
          userId!
        );

      res.json(survey);
    } catch {
      res
        .status(500)
        .json({
          error:
            "Failed to create survey",
        });
    }
  };

export const getSurveyBySlugController =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const slug =
         Array.isArray(
           req.params.slug
         )
           ? req.params.slug[0]
           : req.params.slug;

       const survey =
         await getSurveyBySlug(
           slug
         );

      if (!survey) {
        return res
          .status(404)
          .json({
            error:
              "Survey not found",
          });
      }

      res.json(
        survey
      );
    } catch {
      res
        .status(500)
        .json({
          error:
            "Failed to fetch survey",
        });
    }
  };


export const getMySurveysController =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const userId =
        req.user?.userId;

      if (!userId) {
        return res
          .status(401)
          .json({
            error:
              "Unauthorized",
          });
      }

      const surveys =
        await getMySurveys(
          userId
        );

      res.json(
        surveys
      );
    } catch {
      res
        .status(500)
        .json({
          error:
            "Failed to fetch surveys",
        });
    }
  };