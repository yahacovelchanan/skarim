import { Box,Stack,} from "@mui/material";
import { useEffect,useState,} from "react";
import { useParams, useNavigate} from "react-router-dom";
import ShareDialog from "../../components/formBuilder/ShareDialog";
import { getSurvey,updateSurvey,} from "../../services/survey.service";
import type { Survey,Question,} from "../../types/survey";
import QuestionCard from "../../components/formBuilder/QuestionCard";
import BuilderToolbar from "../../components/formBuilder/BuilderToolbar";

const FormBuilderPage =
  () => {
    const { id } =
      useParams<{
        id: string;
      }>();

    const navigate =
      useNavigate();  
  

    const [
      survey,
      setSurvey,
    ] = useState<
      Survey | null
    >(null);

    const [
      shareOpen,
      setShareOpen,
    ] = useState(false);

    const [
      shareUrl,
      setShareUrl,
    ] = useState("");

    useEffect(() => {
      if (!id)
        return;

      const load =
        async () => {
          const data =
            await getSurvey(
              id
            );

          setSurvey(
            data
          );
        };

      load();
    }, [id]);

    const updateQuestion =
      (
        index: number,
        q: Question
      ) => {
        if (!survey)
          return;

        const copy =
          {
            ...survey,
          };

        copy.questions[
          index
        ] = q;

        setSurvey(
          copy
        );
      };

    const deleteQuestion =
      (
        index: number
      ) => {
        if (!survey)
          return;

        const copy =
          {
            ...survey,
          };

        copy.questions =
          copy.questions.filter(
            (
              _,
              i
            ) =>
              i !==
              index
          );

        setSurvey(
          copy
        );
      };

    const addQuestion =
      () => {
        if (!survey)
          return;

        setSurvey({
          ...survey,
          questions: [
            ...survey.questions,
            {
              id:
                crypto.randomUUID(),

              title:
                "",

              type:
                "short_text",

              required:
                false,

              options:
                [],
            },
          ],
        });
      };

    const saveSurvey =
      async () => {
        if (
          !id ||
          !survey
        )
          return;

        const updated =
          await updateSurvey(
            id,
            survey
          );

        const url =
          `${window.location.origin}/f/${updated.slug}`;

        setShareUrl(
          url
        );

        setShareOpen(
          true
        );
      };

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
          maxWidth:
            900,
          mx: "auto",
          p: 3,
        }}
      >
        <BuilderToolbar
          onAdd={
            addQuestion
          }
          onSave={
            saveSurvey
          }
        />

        <Stack
          spacing={2}
        >
          {survey.questions.map(
            (
              q,
              i
            ) => (
              <QuestionCard
                key={q.id}
                question={
                  q
                }
                index={
                  i
                }
                updateQuestion={
                  updateQuestion
                }
                deleteQuestion={
                  deleteQuestion
                }
              />
            )
          )}
        </Stack>

        <ShareDialog
          open={shareOpen}
          onClose={() => {
            setShareOpen(
              false
            );
        
            navigate("/");
          }}
          url={shareUrl}
        />
      </Box>
    );
  };

export default FormBuilderPage;