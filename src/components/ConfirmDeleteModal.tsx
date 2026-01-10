import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  description: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal = ({
  open,
  title,
  description,
  isLoading,
  onClose,
  onConfirm,
}: ConfirmationModalProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pb: 2, px: 3 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          variant="contained"
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          loading={isLoading}
          disabled={isLoading}
          variant="contained"
          color="error"
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
