import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "./RenameEventDialog.module.scss";

interface RenameEventDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (newEventName: string) => void;
  currentEventName: string | null;
}

const RenameEventDialog = ({ open, onClose, onConfirm, currentEventName }: RenameEventDialogProps) => {
  const [eventName, setEventName] = useState(currentEventName);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setEventName(currentEventName);
      setError("");
    }
  }, [open, currentEventName]);

  const handleConfirm = () => {
    if (eventName !== null) {
      if (!eventName.trim()) {
        setError("Le nom de l'événement ne peut pas être vide.");
        return;
      }

      if (eventName === currentEventName) {
        setError("Le nouveau nom de l'événement doit être différent de l'actuel.");
        return;
      }

      onConfirm(eventName);
      onClose();
    } else {
      setError("Aucun évènement n'est sélectionné (le nom de l'évènement est null).");
    }
  };

  return (
    <Dialog
      className={styles["dialog"]}
      classes={{ paper: styles["dialog-paper"] }}
      open={open}
      onClose={onClose}
      aria-labelledby="rename-event-dialog-title"
    >
      <DialogContent>
        <DialogContentText id="dialog-content-text" className={styles["dialog-content-text"]}>
          Renommer l'événement
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="eventName"
          label="Nouveau nom de l'événement"
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

export default RenameEventDialog;
