import {Box,Button,Dialog,DialogTitle,DialogContent,DialogActions,TextField,Typography,Stack,Card,} from "@mui/material";
import {useEffect,useState,} from "react";
import { useNavigate} from "react-router-dom";
import {createSurvey, getMySurveys} from "../../services/survey.service";
import type {Survey} from "../../types/survey";

const DashboardPage =
  () => {
    const navigate =
      useNavigate();

    const [open,
      setOpen] =
      useState(false);

    const [title,
      setTitle] =
      useState("");

    const [
      description,
      setDescription,
    ] =
      useState("");

    const [surveys,
      setSurveys] =
      useState<
        Survey[]
      >([]);

    useEffect(() => {
      const load =
        async () => {
          const data =
            await getMySurveys();

          setSurveys(
            data
          );
        };

      load();
    }, []);

    const handleCreate =
      async () => {
        const survey =
          await createSurvey(
            title,
            description
          );

        navigate(
          `/builder/${survey._id}`
        );
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
            justifyContent:
              "space-between",
            mb: 4,
          }}
        >
          <Typography variant="h3">
            My Surveys
          </Typography>

          <Button
            variant="contained"
            onClick={() =>
              setOpen(true)
            }
          >
            Create Survey
          </Button>
        </Stack>

        <Stack spacing={2}>
          {surveys.map(
            (survey) => (
              <Card
                key={
                  survey._id
                }
                sx={{
                  p: 3,
                }}
              >
                <Typography
                  variant="h6"
                >
                  {
                    survey.title
                  }
                </Typography>

                <Typography
                  sx={{
                    mb: 2,
                  }}
                >
                  {
                    survey.description
                  }
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
            )
          )}
        </Stack>

        <Dialog
          open={open}
          onClose={() =>
            setOpen(false)
          }
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Create Survey
          </DialogTitle>

          <DialogContent>
            <Stack
              spacing={2}
              sx={{
                mt: 1,
              }}
            >
              <TextField
                label="Title"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                fullWidth
              />

              <TextField
                label="Description"
                value={
                  description
                }
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
              onClick={
                handleCreate
              }
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

export default DashboardPage;