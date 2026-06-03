import { Box,Button,Card,Typography, TextField,RadioGroup,FormControlLabel,Radio,Checkbox,Stack,} from "@mui/material";
import {useEffect,useState,} from "react";
import {useParams,} from "react-router-dom";
import {getSurvey,getSurveyBySlug,} from "../../services/survey.service";
import {submitResponse,} from "../../services/response.service";
import type {Survey,Question,} from "../../types/survey";
import type {Answer,} from "../../types/response";

const FormViewPage =
  () => {
    const {
      id,
      slug,
    } = useParams<{
      id?: string;
      slug?: string;
    }>();

    const [survey,
      setSurvey] =
      useState<
        Survey | null
      >(null);

    const [answers,
      setAnswers] =
      useState<
        Answer[]
      >([]);
    
    const [submitted,
      setSubmitted] =
      useState(false);
    
    useEffect(() => {
  const load =
    async () => {
      let data:
        Survey | null =
          null;

      if (slug) {
        data =
          await getSurveyBySlug(
            slug
          );
      } else if (id) {
        data =
          await getSurvey(
            id
          );
      }

      if (!data)
        return;

      setSurvey(
        data
      );
      const alreadySubmitted =
        localStorage.getItem(
          `survey_${data._id}`
        );

      if (
        alreadySubmitted
      ) {
        setSubmitted(
          true
        );
      }

      setAnswers(
        data.questions.map(
          (
            q:
              Question
          ) => ({
            questionId:
              q.id,
            answer:
              "",
          })
        )
      );
    };

  load();
}, [id, slug]);

    const updateAnswer =
      (
        questionId:
          string,
        value:
          string
      ) => {
        setAnswers(
          (
            prev
          ) =>
            prev.map(
              (
                a
              ) =>
                a.questionId ===
                questionId
                  ? {
                      ...a,
                      answer:
                        value,
                    }
                  : a
            )
        );
      };

    const toggleCheckbox =
      (
        questionId:
          string,
        value:
          string
      ) => {
        setAnswers(
          (
            prev
          ) =>
            prev.map(
              (
                a
              ) => {
                if (
                  a.questionId !==
                  questionId
                )
                  return a;

                const current =
                  Array.isArray(
                    a.answer
                  )
                    ? a.answer
                    : [];

                const exists =
                  current.includes(
                    value
                  );

                return {
                  ...a,
                  answer:
                    exists
                      ? current.filter(
                          (
                            x
                          ) =>
                            x !==
                            value
                        )
                      : [
                          ...current,
                          value,
                        ],
                };
              }
            )
        );
      };

    

    const handleSubmit =
  async () => {
    if (
      !survey?._id
    )
      return;

    await submitResponse(
      survey._id,
      answers
    );

    localStorage.setItem(
      `survey_${survey._id}`,
      "submitted"
    );

    setSubmitted(
      true
    );
  };
  if (submitted) {
  return (
    <Box
      sx={{
        minHeight:
          "100vh",
        display:
          "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        p: 4,
      }}
    >
      <Card
        sx={{
          p: 5,
          maxWidth: 500,
          textAlign:
            "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
          }}
        >
          תודה על
          השתתפותכם 🙌
        </Typography>

        <Typography>
          התשובות שלכם
          נשמרו בהצלחה.
        </Typography>
      </Card>
    </Box>
  );
}

    if (!survey) {
      return (
        <div>
          Loading...
        </div>
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
          sx={{
            mb: 4,
          }}
        >
          {
            survey.title
          }
        </Typography>

        <Stack
          spacing={3}
        >
          {survey.questions.map(
            (
              q:
                Question
            ) => (
              <Card
                key={
                  q.id
                }
                sx={{
                  p: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                  }}
                >
                  {
                    q.title
                  }
                </Typography>

                {q.type ===
                  "short_text" && (
                  <TextField
                    fullWidth
                    onChange={(
                      e
                    ) =>
                      updateAnswer(
                        q.id,
                        e.target
                          .value
                      )
                    }
                  />
                )}

                {q.type ===
                  "multiple_choice" && (
                  <RadioGroup
                    onChange={(
                      e
                    ) =>
                      updateAnswer(
                        q.id,
                        e.target
                          .value
                      )
                    }
                  >
                    {q.options.map(
                      (
                        option
                      ) => (
                        <FormControlLabel
                          key={
                            option
                          }
                          value={
                            option
                          }
                          control={
                            <Radio />
                          }
                          label={
                            option
                          }
                        />
                      )
                    )}
                  </RadioGroup>
                )}

                {q.type ===
                  "checkbox" && (
                  <Stack>
                    {q.options.map(
                      (
                        option
                      ) => (
                        <FormControlLabel
                          key={
                            option
                          }
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
                          label={
                            option
                          }
                        />
                      )
                    )}
                  </Stack>
                )}
              </Card>
            )
          )}

          <Button
            variant="contained"
            onClick={
              handleSubmit
            }
          >
            Submit
          </Button>
        </Stack>
      </Box>
    );
  };

export default FormViewPage;