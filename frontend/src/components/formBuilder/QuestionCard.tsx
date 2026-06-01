import {
  Card,
  TextField,
  Stack,
  IconButton,
  Switch,
  Typography,
  MenuItem,
  Divider,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import OptionEditor
  from "./OptionEditor";

import type {
  Question,
  QuestionType,
} from "../../types/survey";

type Props = {
  question: Question;
  index: number;

  updateQuestion: (
    index: number,
    q: Question
  ) => void;

  deleteQuestion: (
    index: number
  ) => void;
};

const QuestionCard = ({
  question,
  index,
  updateQuestion,
  deleteQuestion,
}: Props) => {
  const showOptions =
    question.type ===
      "multiple_choice" ||
    question.type ===
      "checkbox";

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
      }}
    >
      <Stack spacing={3}>
        {/* TITLE */}
        <TextField
          label="Question title"
          value={
            question.title
          }
          onChange={(
            e
          ) =>
            updateQuestion(
              index,
              {
                ...question,
                title:
                  e.target
                    .value,
              }
            )
          }
          fullWidth
        />

        {/* TYPE */}
        <TextField
          select
          label="Question type"
          value={
            question.type
          }
          onChange={(
            e
          ) =>
            updateQuestion(
              index,
              {
                ...question,
                type:
                  e.target
                    .value as QuestionType,

                options:
                  e.target
                    .value ===
                    "short_text"
                    ? []
                    : question.options
                        .length
                    ? question.options
                    : [
                        "Option 1",
                      ],
              }
            )
          }
        >
          <MenuItem value="short_text">
            Short Text
          </MenuItem>

          <MenuItem value="multiple_choice">
            Multiple Choice
          </MenuItem>

          <MenuItem value="checkbox">
            Checkbox
          </MenuItem>
        </TextField>

        {/* OPTIONS */}
        {showOptions && (
          <>
            <Divider />

            <OptionEditor
              options={
                question.options
              }
              onChange={(
                options
              ) =>
                updateQuestion(
                  index,
                  {
                    ...question,
                    options,
                  }
                )
              }
            />
          </>
        )}

        <Divider />

        {/* FOOTER */}
        <Stack
          direction="row"
          sx={{
            justifyContent:
              "space-between",
            alignItems:
              "center",
          }}
        >
          <Stack
            direction="row"
            sx={{
              alignItems:
                "center",
            }}
          >
            <Typography>
              Required
            </Typography>

            <Switch
              checked={
                question.required
              }
              onChange={(
                e
              ) =>
                updateQuestion(
                  index,
                  {
                    ...question,
                    required:
                      e.target
                        .checked,
                  }
                )
              }
            />
          </Stack>

          <IconButton
            onClick={() =>
              deleteQuestion(
                index
              )
            }
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Card>
  );
};

export default QuestionCard;