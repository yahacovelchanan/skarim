import {
  Box,
  Button,
  Card,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Stack,
  Alert,
} from "@mui/material";
import {
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import {
  getSurvey,
  getSurveyBySlug,
} from "../../services/survey.service";
import { submitResponse } from "../../services/response.service";
import type {
  Survey,
  Question,
} from "../../types/survey";
import type { Answer } from "../../types/response";

const isAnswerEmpty = (
  answer: string | string[]
) => {
  if (Array.isArray(answer)) {
    return answer.length === 0;
  }

  return answer.trim() === "";
};

const FormViewPage = () => {
  const { id, slug } = useParams<{
    id?: string;
    slug?: string;
  }>();

  const [survey, setSurvey] =
    useState<Survey | null>(null);

  const [answers, setAnswers] =
    useState<Answer[]>([]);

  const [submitted, setSubmitted] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [fieldErrors, setFieldErrors] =
    useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        let data: Survey | null = null;

        if (slug) {
          data = await getSurveyBySlug(slug);
        } else if (id) {
          data = await getSurvey(id);
        }

        if (!data) {
          setSurvey(null);
          return;
        }

        setSurvey(data);

        const submissionKey =
          `survey_${data._id}_v${data.version}`;

        const alreadySubmitted =
          localStorage.getItem(submissionKey);

        if (alreadySubmitted) {
          setSubmitted(true);
        }

        setAnswers(
          data.questions.map(
            (q: Question) => ({
              questionId: q.id,
              answer:
                q.type === "checkbox"
                  ? []
                  : "",
            })
          )
        );
      } catch {
        setSurvey(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, slug]);

  const clearFieldError = (
    questionId: string
  ) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const updateAnswer = (
    questionId: string,
    value: string
  ) => {
    clearFieldError(questionId);

    setAnswers((prev) =>
      prev.map((a) =>
        a.questionId === questionId
          ? {
              ...a,
              answer: value,
            }
          : a
      )
    );
  };

  const toggleCheckbox = (
    questionId: string,
    value: string
  ) => {
    clearFieldError(questionId);

    setAnswers((prev) =>
      prev.map((a) => {
        if (a.questionId !== questionId) {
          return a;
        }

        const current = Array.isArray(
          a.answer
        )
          ? a.answer
          : [];

        const exists =
          current.includes(value);

        return {
          ...a,
          answer: exists
            ? current.filter(
                (x) => x !== value
              )
            : [...current, value],
        };
      })
    );
  };

  const validateRequiredQuestions = () => {
    if (!survey) {
      return false;
    }

    const errors: Record<string, string> = {};

    survey.questions.forEach((question) => {
      if (!question.required) {
        return;
      }

      const answer = answers.find(
        (a) =>
          a.questionId === question.id
      );

      if (
        !answer ||
        isAnswerEmpty(answer.answer)
      ) {
        errors[question.id] =
          "This question is required";
      }
    });

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!survey?._id) return;

    setError("");

    const isValid =
      validateRequiredQuestions();

    if (!isValid) {
      setError(
        "Please answer all required questions."
      );
      return;
    }

    try {
      await submitResponse(
        survey._id,
        answers
      );

      localStorage.setItem(
        `survey_${survey._id}_v${survey.version}`,
        "submitted"
      );

      setSubmitted(true);
    } catch (err: unknown) {
      let serverError:
        | {
            error?: string;
            questionId?: string;
          }
        | undefined;

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
      ) {
        const axiosError = err as {
          response?: {
            data?: {
              error?: string;
              questionId?: string;
            };
          };
        };

        serverError = axiosError.response?.data;
      }

      if (serverError?.questionId) {
        setFieldErrors({
          [serverError.questionId]:
            "This question is required",
        });
      }

      setError(
        serverError?.error ||
          "Failed to submit response"
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!survey) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Card
          sx={{
            p: 5,
            maxWidth: 500,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 2 }}
          >
            הסקר לא נמצא
          </Typography>

          <Typography>
            יכול להיות שהסקר נמחק, נסגר, או שהקישור שגוי.
          </Typography>
        </Card>
      </Box>
    );
  }

  if (submitted) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Card
          sx={{
            p: 5,
            maxWidth: 500,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 2 }}
          >
            תודה על השתתפותכם 🙌
          </Typography>

          <Typography>
            התשובות שלכם נשמרו בהצלחה.
          </Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        p: 4,
      }}
    >
      <Typography
        variant="h3"
        sx={{ mb: 4 }}
      >
        {survey.title}
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        {survey.questions.map(
          (q: Question) => {
            const fieldError =
              fieldErrors[q.id];

            return (
              <Card
                key={q.id}
                sx={{
                  p: 3,
                  border: fieldError
                    ? "1px solid #d32f2f"
                    : undefined,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 2 }}
                >
                  {q.title}
                  {q.required && " *"}
                </Typography>

                {q.type === "short_text" && (
                  <TextField
                    fullWidth
                    error={Boolean(fieldError)}
                    helperText={fieldError}
                    onChange={(e) =>
                      updateAnswer(
                        q.id,
                        e.target.value
                      )
                    }
                  />
                )}

                {q.type ===
                  "multiple_choice" && (
                  <>
                    <RadioGroup
                      onChange={(e) =>
                        updateAnswer(
                          q.id,
                          e.target.value
                        )
                      }
                    >
                      {q.options.map(
                        (option) => (
                          <FormControlLabel
                            key={option}
                            value={option}
                            control={<Radio />}
                            label={option}
                          />
                        )
                      )}
                    </RadioGroup>

                    {fieldError && (
                      <Typography
                        color="error"
                        variant="body2"
                        sx={{ mt: 1 }}
                      >
                        {fieldError}
                      </Typography>
                    )}
                  </>
                )}

                {q.type === "checkbox" && (
                  <>
                    <Stack>
                      {q.options.map(
                        (option) => (
                          <FormControlLabel
                            key={option}
                            control={
                              <Checkbox
                                onChange={() =>
                                  toggleCheckbox(
                                    q.id,
                                    option
                                  )
                                }
                              />
                            }
                            label={option}
                          />
                        )
                      )}
                    </Stack>

                    {fieldError && (
                      <Typography
                        color="error"
                        variant="body2"
                        sx={{ mt: 1 }}
                      >
                        {fieldError}
                      </Typography>
                    )}
                  </>
                )}
              </Card>
            );
          }
        )}

        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export default FormViewPage;