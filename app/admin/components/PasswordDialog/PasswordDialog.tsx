"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "./PasswordDialog.module.scss";
import { isPasswordComplex } from "@/app/services/inputValidator";

const PasswordDialog = ({ open, onClose, onConfirm }: PasswordDialogProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!newPassword.trim()) {
      setError("Le mot de passe ne peut pas être vide.");
      return;
    }

    if (!isPasswordComplex(newPassword)) {
      setError("Le mot de passe doit faire au moins 8 caractères de chiffres ET de lettres.");
      return;
    }

    onConfirm(newPassword);
    setTimeout(() => {
      setNewPassword("");
      setError("");
    }, 1000);
  };

  return (
    <Dialog className={styles["dialog"]} classes={{ paper: styles["dialog-paper"] }} disableScrollLock={true} open={open} onClose={onClose}>
      <DialogContent>
        <DialogContentText className={styles["dialog-content-text"]} id="alert-dialog-description">
          <span>Réinitialiser le mot de passe</span>
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="newPassword"
          placeholder="Nouveau mot de passed"
          label=""
          type="text"
          fullWidth
          variant="standard"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions className={styles["buttons"]}>
        <Button className={`${styles["button"]} ${styles["cancel-button"]}`} onClick={onClose}>
          Annuler
        </Button>
        <Button className={`${styles["button"]} ${styles["confirm-button"]}`} onClick={handleConfirm}>
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordDialog;
