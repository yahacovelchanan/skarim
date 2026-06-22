import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Stack,
  Card,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  createSurvey,
  getMySurveys,
  deleteSurvey,
} from "../../services/survey.service";
import type { Survey } from "../../types/survey";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [open, setOpen] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [surveys, setSurveys] =
    useState<Survey[]>([]);

  const [
    surveyToDelete,
    setSurveyToDelete,
  ] = useState<Survey | null>(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    const load = async () => {
      const data = await getMySurveys();
      setSurveys(data);
    };

    load();
  }, []);

  const handleCreate = async () => {
    const survey = await createSurvey(
      title,
      description
    );

    navigate(`/builder/${survey._id}`);
  };

  const requestDelete = (
    survey: Survey
  ) => {
    setSurveyToDelete(survey);
  };

  const cancelDelete = () => {
    setSurveyToDelete(null);
  };

  const confirmDelete = async () => {
    if (!surveyToDelete) return;

    try {
      await deleteSurvey(
        surveyToDelete._id
      );

      setSurveys((prev) =>
        prev.filter(
          (survey) =>
            survey._id !==
            surveyToDelete._id
        )
      );

      setMessage("הסקר נמחק בהצלחה");
      setSurveyToDelete(null);
    } catch {
      setError("מחיקת הסקר נכשלה");
    }
  };

  return (
    <Box
      sx={{
        p: 5,
        maxWidth: 1000,
        mx: "auto",
      }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Typography variant="h3">
          My Surveys
        </Typography>

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Create Survey
        </Button>
      </Stack>

      <Stack spacing={2}>
        {surveys.map((survey) => (
          <Card
            key={survey._id}
            sx={{
              p: 3,
              position: "relative",
            }}
          >
            <IconButton
              onClick={() =>
                requestDelete(survey)
              }
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
              }}
            >
              <DeleteIcon />
            </IconButton>

            <Typography variant="h6">
              {survey.title}
            </Typography>

            <Typography sx={{ mb: 2 }}>
              {survey.description}
            </Typography>

            <Stack
              direction="row"
              spacing={2}
            >
              <Button
                variant="outlined"
                onClick={() =>
                  navigate(
                    `/builder/${survey._id}`
                  )
                }
              >
                Edit
              </Button>

              <Button
                variant="contained"
                onClick={() =>
                  navigate(
                    `/results/${survey._id}`
                  )
                }
              >
                Results
              </Button>
            </Stack>
          </Card>
        ))}
      </Stack>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Create Survey
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={2}
            sx={{ mt: 1 }}
          >
            <TextField
              label="Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              fullWidth
            />

            <TextField
              label="Description"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              multiline
              rows={4}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreate}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(surveyToDelete)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity="warning"
          variant="filled"
          action={
            <Stack
              direction="row"
              spacing={1}
            >
              <Button
                color="inherit"
                size="small"
                onClick={cancelDelete}
              >
                ביטול
              </Button>

              <Button
                color="inherit"
                size="small"
                onClick={confirmDelete}
              >
                מחק
              </Button>
            </Stack>
          }
        >
          למחוק את הסקר
          {surveyToDelete
            ? ` "${surveyToDelete.title}"`
            : ""}
          ?
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={2500}
        onClose={() => setMessage("")}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={2500}
        onClose={() => setError("")}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardPage;