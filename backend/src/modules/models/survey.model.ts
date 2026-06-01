import mongoose from "mongoose";

export interface ISurvey {
  title: string;
  description: string;
  slug: string;
  createdBy: string;
  questions: {
    id: string;
    type:
      | "short_text"
      | "multiple_choice"
      | "checkbox";
    title: string;
    required: boolean;
    options: string[];
  }[];
}

const questionSchema =
  new mongoose.Schema({
    id: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "short_text",
        "multiple_choice",
        "checkbox",
      ],
    },

    title: {
      type: String,
      default: "",
    },

    required: {
      type: Boolean,
      default: false,
    },

    options: {
      type: [String],
      default: [],
    },
  });

const surveySchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        default: "",
      },

      slug: {
        type: String,
        required: true,
        unique: true,
      },

      createdBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "User",
      },

      settings: {
        collectRespondentData:
          {
            type: Boolean,
            default: false,
          },

        allowMultipleSubmissions:
          {
            type: Boolean,
            default: true,
          },

        isPublic: {
          type: Boolean,
          default: true,
        },
      },

      questions: [
        questionSchema,
      ],
    },
    {
      timestamps: true,
    }
  );

export const Survey =
  mongoose.model<ISurvey>(
    "Survey",
    surveySchema
  );