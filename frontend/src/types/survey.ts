export type QuestionType =
  | "short_text"
  | "multiple_choice"
  | "checkbox";


export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  required: boolean;
  options: string[];
}

export interface Survey {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  questions: Question[];
}