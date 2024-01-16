"use client";

import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "./PasswordDialog.module.scss";
import { Titan_One } from "next/font/google";
import { isPasswordComplex } from "@/app/services/inputValidator";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

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
    setNewPassword("");
    setError("");
  };

  return (
    <Dialog className={styles["dialog"]} classes={{ paper: styles["dialog-paper"] }} open={open} onClose={onClose}>
      <DialogTitle className={`${styles["dialog-title"]} ${titan_one.className}`}>Réinitialiser le mot de passe</DialogTitle>
      <DialogContent>
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
      <DialogActions>
        <Button className={`${styles["button"]} ${styles["confirm-button"]}`} onClick={handleConfirm}>
          Confirmer
        </Button>
        <Button className={`${styles["button"]} ${styles["cancel-button"]}`} onClick={onClose}>
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordDialog;
