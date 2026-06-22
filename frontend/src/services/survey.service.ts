import api from "../api/axios";
import type { Survey } from "../types/survey";

export const createSurvey =
  async (
    title: string,
    description: string
  ) => {
    const response =
      await api.post(
        "/surveys",
        {
          title,
          description,
        }
      );

    return response.data;
  };

export const getSurvey =
  async (id: string) => {
    const response =
      await api.get(
        `/surveys/${id}`
      );

    return response.data;
  };

export const updateSurvey =
  async (
    id: string,
    data: Partial<Survey>
  ) => {
    const response =
      await api.patch(
        `/surveys/${id}`,
        data
      );

    return response.data;
  };

export const getSurveyBySlug =
  async (slug: string) => {
    const res =
      await api.get(
        `/surveys/slug/${slug}`
      );

    return res.data;
  };

   export const getMySurveys =
  async () => {
    const response =
      await api.get(
        "/surveys/my"
      );

    return response.data;
  };

  export const deleteSurvey = async (
  surveyId: string
) => {
  const response =
    await api.delete(
      `/surveys/${surveyId}`
    );

  return response.data;
};