import { Request, Response }from "express";
import { Response as ResponseModel }from "../models/response.model";
import { Survey } from "../models/survey.model";

export const submitResponse =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        surveyId,
        answers,
      } = req.body;

      const forwarded =
        req.headers[
          "x-forwarded-for"
        ];

      const ip =
        typeof forwarded ===
        "string"
          ? forwarded
          : req.socket
              .remoteAddress ||
            "unknown";

      const survey =
        await Survey.findById(
          surveyId
        );

      if (!survey) {
        return res
          .status(404)
          .json({
            error:
              "Survey not found",
          });
      }

      const existingResponse =
        await ResponseModel.findOne({
          surveyId,
          ip,
          surveyVersion:
           survey.version,
        });

      if (
        existingResponse
      ) {
        return res
          .status(400)
          .json({
            error:
              "You already answered this survey",
          });
      }

      const result =
        await ResponseModel.create({
          surveyId,
          answers,
          ip,
          surveyVersion:
            survey.version,
        });

      res.json(result);
    } catch {
      res.status(500).json({
        error:
          "Failed to submit response",
      });
    }
  };


export const getSurveyResponses = async (
  req: Request,
  res: Response
) => {
  try {
    const surveyIdRaw = req.params.surveyId;

    const surveyId = Array.isArray(surveyIdRaw)
      ? surveyIdRaw[0]
      : surveyIdRaw;

    if (!surveyId) {
      return res.status(400).json({
        error: "Invalid surveyId",
      });
    }

    const responses =
      await ResponseModel.find({
        surveyId,
      });

    // 📊 summary בסיסי
    const total = responses.length;

    res.json({
      total,
      responses,
    });
  } catch {
    res.status(500).json({
      error: "Failed to fetch responses",
    });
  }
};