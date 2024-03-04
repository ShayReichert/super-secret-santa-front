import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "./NewEventDialog.module.scss";

interface NewEventDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (eventName: string) => void;
}

const NewEventDialog = ({ open, onClose, onConfirm }: NewEventDialogProps) => {
  const [eventName, setEventName] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!eventName.trim()) {
      setError("Le nom de l'événement ne peut pas être vide.");
      return;
    }

    onConfirm(eventName);
    setEventName("");
    onClose();
  };

  return (
    <Dialog
      className={styles["dialog"]}
      classes={{ paper: styles["dialog-paper"] }}
      open={open}
      onClose={onClose}
      aria-labelledby="new-event-dialog-title"
    >
      <DialogContent>
        <DialogContentText id="dialog-content-text" className={styles["dialog-content-text"]}>
          Créer un nouvel événement
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="eventName"
          label="Nom de l'événement"
          type="text"
          variant="standard"
          fullWidth
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions className={styles.buttons}>
        <Button onClick={onClose} className={styles["cancel-button"]}>
          Annuler
        </Button>
        <Button onClick={handleConfirm} className={styles["confirm-button"]}>
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewEventDialog;
