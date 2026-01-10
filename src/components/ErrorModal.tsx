import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  AlertTitle,
  Typography,
  Box,
} from "@mui/material";

type ErrorModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  closeText?: string;
};

const ErrorModal = ({
  open,
  onClose,
  title = "Something went wrong",
  message = "An error occurred.",
  closeText = "Close",
}: ErrorModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="error-dialog-title">
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6">{title}</Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          <Typography id="error-dialog-description">{message}</Typography>
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          {closeText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorModal;
