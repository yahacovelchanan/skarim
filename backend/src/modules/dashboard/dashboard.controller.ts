import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { Survey } from "../models/survey.model";
import { Response as ResponseModel } from "../models/response.model";

export const getDashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    const surveys = await Survey.find({
      createdBy: userId,
    });

    const surveysWithStats = await Promise.all(
      surveys.map(async (s) => {
        const responses = await ResponseModel.countDocuments({
          surveyId: s._id,
        });

        return {
          ...s.toObject(),
          responsesCount: responses,
        };
      })
    );

    res.json(surveysWithStats);
  } catch {
    res.status(500).json({
      error: "Failed to load dashboard",
    });
  }
};