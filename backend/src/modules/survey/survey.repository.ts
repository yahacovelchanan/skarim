import { Survey } from "../models/survey.model"
import { ISurvey } from "../models/survey.model";


export const createSurveyRepo =
  (data: Partial<ISurvey>) => {
    return Survey.create(data);
  };

export const getSurveyRepo =
  (id: string) => {
    return Survey.findById(id);
  };

export const updateSurveyRepo =
  (
    id: string,
    data: Partial<ISurvey>
  ) => {
    return Survey.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );
  };

export const getSurveyBySlugRepo =
  async (
    slug: string
  ) => {
    return Survey.findOne({
      slug,
    });
  };