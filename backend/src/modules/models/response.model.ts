import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Survey",
    },

    ip: {
      type: String,
      required: true,
    },

    answers: [
      {
        questionId: String,
        answer: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

export const Response = mongoose.model(
  "Response",
  responseSchema
);