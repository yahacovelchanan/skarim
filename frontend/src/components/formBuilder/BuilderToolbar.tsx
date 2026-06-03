import {Stack,Button,Typography} from "@mui/material";

type Props = {
  onAdd: () => void;
  onSave: () => void;
};

const BuilderToolbar = ({
  onAdd,
  onSave,
}: Props) => {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent:
          "space-between",
        mb: 3,
        p: 2,
        borderBottom:
          "1px solid #ddd",
      }}
    >
      <Typography
        variant="h6"
      >
        Form Builder
      </Typography>

      <Stack
        direction="row"
        spacing={2}
      >
        <Button
          variant="outlined"
          onClick={onAdd}
        >
          Add Question
        </Button>

        <Button
          variant="contained"
          onClick={onSave}
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
};

export default BuilderToolbar;