import api from "../api/axios";
import type { Answer } from "../types/response";

export const submitResponse = async (
  surveyId: string,
  answers: Answer[]
) => {
  const res = await api.post("/responses", {
    surveyId,
    answers,
  });

  return res.data;
};


export const getResponses =
  async (
    surveyId: string
  ) => {
    const res =
      await api.get(
        `/responses/${surveyId}`
      );

    return res.data;
  };