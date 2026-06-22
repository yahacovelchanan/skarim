import { Survey } from "../models/survey.model";
import { ISurvey } from "../models/survey.model";

export const createSurveyRepo = (
  data: Partial<ISurvey>
) => {
  return Survey.create(data);
};

export const getSurveyRepo = (
  id: string
) => {
  return Survey.findById(id);
};

export const updateSurveyByOwnerRepo =
  async (
    id: string,
    userId: string,
    data: Partial<ISurvey>
  ) => {
    const existingSurvey =
      await Survey.findOne({
        _id: id,
        createdBy: userId,
      });

    if (!existingSurvey) {
      return null;
    }

    const currentData = {
  title: existingSurvey.title,
  description: existingSurvey.description,
  questions: existingSurvey.questions,
};

const incomingData = {
  title: data.title ?? existingSurvey.title,
  description:
    data.description ??
    existingSurvey.description,
  questions:
    data.questions ??
    existingSurvey.questions,
};

    const hasChanges =
      JSON.stringify(currentData) !==
      JSON.stringify(incomingData);

    if (!hasChanges) {
      return existingSurvey;
    }

    const {
      version,
      ...dataWithoutVersion
    } = data;

    return Survey.findOneAndUpdate(
      {
        _id: id,
        createdBy: userId,
      },
      {
        $set: dataWithoutVersion,
        $inc: {
          version: 1,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  };

export const deleteSurveyByOwnerRepo =
  (
    id: string,
    userId: string
  ) => {
    return Survey.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });
  };

export const getSurveyBySlugRepo =
  async (slug: string) => {
    return Survey.findOne({
      slug,
    });
  };