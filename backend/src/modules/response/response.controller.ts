import {
  Request,
  Response,
} from "express";
import { Response as ResponseModel } from "../models/response.model";
import { Survey } from "../models/survey.model";

const isAnswerEmpty = (
  value: unknown
) => {
  if (
    value === undefined ||
    value === null
  ) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim() === "";
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  return false;
};

export const submitResponse = async (
  req: Request,
  res: Response
) => {
  try {
    const { surveyId, answers } =
      req.body;

    if (!surveyId) {
      return res.status(400).json({
        error: "Missing surveyId",
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        error: "Answers must be an array",
      });
    }

    const survey =
      await Survey.findById(surveyId);

    if (!survey) {
      return res.status(404).json({
        error: "Survey not found",
      });
    }

    const surveyVersion =
      survey.version ?? 1;

    const forwarded =
      req.headers["x-forwarded-for"];

    const ip =
      typeof forwarded === "string"
        ? forwarded.split(",")[0].trim()
        : req.socket.remoteAddress ||
          "unknown";

    const requiredQuestions =
      survey.questions.filter(
        (question) => question.required
      );

    for (const question of requiredQuestions) {
      const answerItem = answers.find(
        (item: {
          questionId: string;
          answer: unknown;
        }) =>
          item.questionId === question.id
      );

      if (
        !answerItem ||
        isAnswerEmpty(answerItem.answer)
      ) {
        return res.status(400).json({
          error: "Question is required",
          questionId: question.id,
        });
      }
    }

    const existingResponse =
      await ResponseModel.findOne({
        surveyId,
        ip,
        surveyVersion,
      });

    if (existingResponse) {
      return res.status(400).json({
        error:
          "You already answered this survey",
      });
    }

    const result =
      await ResponseModel.create({
        surveyId,
        answers,
        ip,
        surveyVersion,
      });

    return res.json(result);
  } catch (err) {
    console.error(
      "Failed to submit response:",
      err
    );

    return res.status(500).json({
      error: "Failed to submit response",
    });
  }
};

export const getSurveyResponses = async (
  req: Request,
  res: Response
) => {
  try {
    const surveyIdRaw =
      req.params.surveyId;

    const surveyId = Array.isArray(
      surveyIdRaw
    )
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

    return res.json({
      total: responses.length,
      responses,
    });
  } catch (err) {
    console.error(
      "Failed to fetch responses:",
      err
    );

    return res.status(500).json({
      error: "Failed to fetch responses",
    });
  }
};