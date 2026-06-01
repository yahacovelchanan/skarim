
import {
  Box,
  Card,
  Stack,
  Typography,
} from "@mui/material";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  getSurvey,
} from "../../services/survey.service";

import {
  getResponses,
} from "../../services/response.service";

import MultipleChoiceChart
  from "../../pages/results/MultipleChoiceChart";

import type {
  Survey,
  Question,
} from "../../types/survey";

import type {
  Answer,
} from "../../types/response";

type SurveyResponse = {
  _id: string;
  answers: Answer[];
};

const ResultsPage =
  () => {
    const { id } =
      useParams<{
        id: string;
      }>();

    const [survey,
      setSurvey] =
      useState<
        Survey | null
      >(null);

    const [responses,
      setResponses] =
      useState<
        SurveyResponse[]
      >([]);

    useEffect(() => {
      if (!id) return;

      const load =
        async () => {
          const surveyData =
            await getSurvey(
              id
            );

          const responsesData =
            await getResponses(
              id
            );

          setSurvey(
            surveyData
          );

          setResponses(
            responsesData.responses
          );
        };

      load();
    }, [id]);

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
          maxWidth: 1000,
          mx: "auto",
          p: 4,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            mb: 2,
          }}
        >
          Results
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mb: 4,
          }}
        >
          {responses.length}
          {" "}
          Responses
        </Typography>

        <Stack
          spacing={3}
        >
          {survey.questions.map(
            (
              question:
                Question
            ) => {
              const answers =
                responses.flatMap(
                  (
                    response
                  ) =>
                    response.answers.filter(
                      (
                        a
                      ) =>
                        a.questionId ===
                        question.id
                    )
                );

              return (
                <Card
                  key={
                    question.id
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
                      question.title
                    }
                  </Typography>

                  {/* MULTIPLE CHOICE */}
                  {question.type ===
                    "multiple_choice" && (
                    <MultipleChoiceChart
                      title={
                        question.title
                      }
                      data={question.options.map(
                        (
                          opt
                        ) => ({
                          name:
                            opt,

                          value:
                            answers.filter(
                              (
                                a
                              ) =>
                                a.answer ===
                                opt
                            ).length,
                        })
                      )}
                    />
                  )}

                  {/* SHORT TEXT */}
                  {question.type ===
                    "short_text" && (
                    <Stack
                      spacing={
                        1
                      }
                    >
                      {answers.length ===
                      0 ? (
                        <Typography>
                          No responses
                        </Typography>
                      ) : (
                        answers.map(
                          (
                            a,
                            index
                          ) => (
                            <Typography
                              key={
                                index
                              }
                            >
                              •
                              {" "}
                              {
                                a.answer
                              }
                            </Typography>
                          )
                        )
                      )}
                    </Stack>
                  )}
                </Card>
              );
            }
          )}
        </Stack>
      </Box>
    );
  };

export default ResultsPage;