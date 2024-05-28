"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import styles from "./UserAccountDialog.module.scss";

interface UserAccountDialogProps {
  open: boolean;
  onClose: () => void;
  user: any;
  onUpdate: (user: any) => void;
  onDelete: (id: string) => void;
  errorMessage?: string;
}

const UserAccountDialog = ({ open, onClose, user, onUpdate, onDelete, errorMessage }: UserAccountDialogProps) => {
  const [pseudo, setPseudo] = useState(user.pseudo ? user.pseudo : "");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleUpdate = () => {
    onUpdate({ ...user, pseudo });
    onClose();
  };

  const openDeleteConfirm = () => {
    setIsConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsConfirmOpen(false);
  };

  const confirmDelete = () => {
    onDelete(user.id);
    closeDeleteConfirm();
  };

  return (
    <>
      <Dialog
        className={styles["dialog"]}
        classes={{ paper: styles["dialog-paper"] }}
        open={open}
        onClose={onClose}
        aria-labelledby="account-infos-dialog"
      >
        <DialogTitle className={styles["dialog-title"]}>Mon Compte</DialogTitle>
        <DialogContent>
          <DialogContentText className={styles["dialog-content-text"]}>
            Si vous possédez le même prénom qu'un autre participant·e, merci de renseigner un pseudo
          </DialogContentText>
          <TextField
            margin="normal"
            label="Pseudo"
            type="text"
            variant="standard"
            fullWidth
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />
          <TextField
            className={styles["read-only-field"]}
            margin="normal"
            label="Prénom"
            type="text"
            variant="standard"
            fullWidth
            value={user.userName}
            InputProps={{
              readOnly: true,
              className: styles["read-only-field"],
              inputProps: { tabIndex: -1 },
            }}
          />

          <TextField
            className={styles["read-only-field"]}
            margin="normal"
            label="Email"
            type="email"
            variant="standard"
            fullWidth
            value={user.email}
            InputProps={{
              readOnly: true,
              className: styles["read-only-field"],
              inputProps: { tabIndex: -1 },
            }}
          />
          {errorMessage && <DialogContentText color="error">{errorMessage}</DialogContentText>}
        </DialogContent>
        <Button onClick={openDeleteConfirm} color="error" className={styles["delete-button"]}>
          Supprimer mon compte
        </Button>
        <DialogActions className={styles.buttons}>
          <Button onClick={onClose} className={styles["cancel-button"]}>
            Annuler
          </Button>
          <Button onClick={handleUpdate} className={styles["confirm-button"]}>
            Mettre à jour
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        text="Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
        open={isConfirmOpen}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default UserAccountDialog;
