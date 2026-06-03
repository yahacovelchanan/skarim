import {Dialog,DialogTitle,DialogContent, DialogActions, Button, TextField,Stack,Typography} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  url: string;
};

const ShareDialog = ({
  open,
  onClose,
  url,
}: Props) => {
  const copyLink =
  async () => {
    await navigator.clipboard.writeText(
      url
    );

    alert(
      "Link copied!"
    );

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Survey Saved 🎉
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Typography>
            Share this
            survey:
          </Typography>

          <TextField
            value={url}
            fullWidth
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
        >
          Close
        </Button>

        <Button
          variant="contained"
          onClick={
            copyLink
          }
        >
          Copy Link
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;