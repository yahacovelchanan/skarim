import { randomUUID } from "crypto";
import slugify from "slugify";
import { createSurveyRepo }
from "./survey.repository";

import {
  getSurveyRepo,
  updateSurveyRepo,
  getSurveyBySlugRepo
} from "./survey.repository";

import { ISurvey } from "../models/survey.model";
import { Survey } from "../models/survey.model";

export const getSurvey =
  async (id: string) => {
    return getSurveyRepo(id);
  };

export const updateSurvey =
  async (
    id: string,
    data: Partial<ISurvey>
  ) => {
    return updateSurveyRepo(
      id,
      data
    );
  };

const createSlug = (
  title: string
) => {
  return `${slugify(
    title,
    {
      lower: true,
      strict: true,
      locale: "en",
    }
  )}-${randomUUID()
    .slice(0, 6)}`;
};

export const getSurveyBySlug =
  async (
    slug: string
  ) => {
    return getSurveyBySlugRepo(
      slug
    );
  };

export const createSurvey =
  async (
    title: string,
    description: string,
    userId: string
  ) => {
    const slug =
      createSlug(title);

    return createSurveyRepo(
      {
        title,
        description,
        slug,
        createdBy:
          userId,

        questions: [],
      }
    );
  };

 

export const getMySurveys =
  async (
    userId: string
  ) => {
    return Survey.find({
      createdBy:
        userId,
    }).sort({
      createdAt: -1,
    });
  };