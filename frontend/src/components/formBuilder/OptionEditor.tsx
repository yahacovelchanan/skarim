import {
  Stack,
  TextField,
  IconButton,
  Button,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  options: string[];
  onChange: (options: string[]) => void;
};

const OptionEditor = ({ options, onChange }: Props) => {
  const updateOption = (index: number, value: string) => {
    const copy = [...options];
    copy[index] = value;
    onChange(copy);
  };

  const removeOption = (index: number) => {
    const copy = options.filter((_, i) => i !== index);
    onChange(copy);
  };

  const addOption = () => {
    onChange([...options, ""]);
  };

  return (
    <Stack spacing={1}>
      {options.map((opt, i) => (
        <Stack key={i} direction="row" spacing={1}>
          <TextField
            value={opt}
            onChange={(e) => updateOption(i, e.target.value)}
            size="small"
            fullWidth
          />
          <IconButton onClick={() => removeOption(i)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ))}

      <Button onClick={addOption}>
        Add option
      </Button>
    </Stack>
  );
};

export default OptionEditor;