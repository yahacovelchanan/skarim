import {
  Alert,
  Box,
  Stack,
} from "@mui/material";
import {
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";
import ShareDialog from "../../components/formBuilder/ShareDialog";
import {
  getSurvey,
  updateSurvey,
} from "../../services/survey.service";
import type {
  Survey,
  Question,
} from "../../types/survey";
import QuestionCard from "../../components/formBuilder/QuestionCard";
import BuilderToolbar from "../../components/formBuilder/BuilderToolbar";

const validateSurvey = (
  survey: Survey
) => {
  if (
    !survey.title ||
    survey.title.trim() === ""
  ) {
    return "Survey title is required";
  }

  if (survey.questions.length === 0) {
    return "Survey must have at least one question";
  }

  for (const question of survey.questions) {
    if (
      !question.title ||
      question.title.trim() === ""
    ) {
      return "Every question must have a title";
    }

    if (
      question.type === "multiple_choice" ||
      question.type === "checkbox"
    ) {
      if (question.options.length < 2) {
        return "Choice questions must have at least 2 options";
      }

      const hasEmptyOption =
        question.options.some(
          (option) =>
            option.trim() === ""
        );

      if (hasEmptyOption) {
        return "Options cannot be empty";
      }
    }
  }

  return null;
};

const FormBuilderPage = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const [survey, setSurvey] =
    useState<Survey | null>(null);

  const [shareOpen, setShareOpen] =
    useState(false);

  const [shareUrl, setShareUrl] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const data = await getSurvey(id);
      setSurvey(data);
    };

    load();
  }, [id]);

  const updateQuestion = (
    index: number,
    q: Question
  ) => {
    if (!survey) return;

    const questions =
      [...survey.questions];

    questions[index] = q;

    setSurvey({
      ...survey,
      questions,
    });

    setError("");
  };

  const deleteQuestion = (
    index: number
  ) => {
    if (!survey) return;

    setSurvey({
      ...survey,
      questions: survey.questions.filter(
        (_, i) => i !== index
      ),
    });

    setError("");
  };

  const addQuestion = () => {
    if (!survey) return;

    setSurvey({
      ...survey,
      questions: [
        ...survey.questions,
        {
          id: crypto.randomUUID(),
          title: "",
          type: "short_text",
          required: false,
          options: [],
        },
      ],
    });

    setError("");
  };

  const saveSurvey = async () => {
    if (!id || !survey) return;

    setError("");

    const validationError =
      validateSurvey(survey);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const updated =
        await updateSurvey(id, survey);

      const url =
        `${window.location.origin}/f/${updated.slug}`;

      setShareUrl(url);
      setShareOpen(true);
    } catch (err: unknown) {
      let message =
        "Failed to save survey";

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
      ) {
        const axiosError = err as {
          response?: {
            data?: {
              error?: string;
            };
          };
        };

        message =
          axiosError.response?.data?.error ||
          message;
      }

      setError(message);
    }
  };

  if (!survey) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        p: 3,
      }}
    >
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      <BuilderToolbar
        onAdd={addQuestion}
        onSave={saveSurvey}
      />

      <Stack spacing={2}>
        {survey.questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={i}
            updateQuestion={updateQuestion}
            deleteQuestion={deleteQuestion}
          />
        ))}
      </Stack>

      <ShareDialog
        open={shareOpen}
        onClose={() => {
          setShareOpen(false);
          navigate("/");
        }}
        url={shareUrl}
      />
    </Box>
  );
};

export default FormBuilderPage;