import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";

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
  const [copiedOpen, setCopiedOpen] =
    useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);

    setCopiedOpen(true);

    setTimeout(() => {
      onClose();
    }, 700);
  };

  return (
    <>
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
              Share this survey:
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
          <Button onClick={onClose}>
            Close
          </Button>

          <Button
            variant="contained"
            onClick={copyLink}
          >
            Copy Link
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={copiedOpen}
        autoHideDuration={2500}
        onClose={() =>
          setCopiedOpen(false)
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() =>
            setCopiedOpen(false)
          }
        >
          הקישור הועתק בהצלחה
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareDialog;