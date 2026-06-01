import { Request, Response } from "express";
import { Response as ResponseModel } from "../models/response.model";

export const submitResponse = async (
  req: Request,
  res: Response
) => {
  try {
    const { surveyId, answers } = req.body;
    const ipRaw =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress;

    const ip = Array.isArray(ipRaw)
      ? ipRaw[0]
      : ipRaw || "unknown";

    const result = await ResponseModel.create({
      surveyId,
      answers,
      ip,
    });

    res.json(result);
  } catch {
    res.status(500).json({
      error: "Failed to submit response",
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