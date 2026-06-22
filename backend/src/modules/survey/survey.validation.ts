import { ISurvey } from "../models/survey.model";

export const validateSurveyData = (
  data: Partial<ISurvey>
) => {
  if (
    "title" in data &&
    typeof data.title === "string" &&
    data.title.trim() === ""
  ) {
    return "Survey title is required";
  }

  if (!data.questions) {
    return null;
  }

  if (!Array.isArray(data.questions)) {
    return "Questions must be an array";
  }

  for (const question of data.questions) {
    if (!question.title || question.title.trim() === "") {
      return "Every question must have a title";
    }

    if (
      question.type === "multiple_choice" ||
      question.type === "checkbox"
    ) {
      if (
        !Array.isArray(question.options) ||
        question.options.length < 2
      ) {
        return "Choice questions must have at least 2 options";
      }

      const hasEmptyOption = question.options.some(
        (option) => option.trim() === ""
      );

      if (hasEmptyOption) {
        return "Options cannot be empty";
      }
    }
  }

  return null;
};