"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "./CreateUserDialog.module.scss";
import { isPasswordComplex, isValidEmail } from "@/app/services/inputValidator";

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (newUser: NewUser) => void;
}

const CreateUserDialog = ({ open, onClose, onConfirm }: CreateUserDialogProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!username.trim()) newErrors.username = "Le prénom ne peut pas être vide.";
    if (!email.trim()) newErrors.email = "L'email ne peut pas être vide.";
    else if (!isValidEmail(email)) newErrors.email = "Le format de l'email n'est pas valide.";
    if (!password.trim()) newErrors.password = "Le mot de passe ne peut pas être vide.";
    else if (!isPasswordComplex(password)) newErrors.password = "Le mot de passe doit faire au moins 8 caractères de chiffres ET de lettres.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (validateForm()) {
      onConfirm({ username, email, password });
      setUsername("");
      setEmail("");
      setPassword("");
      onClose();
    }
  };

  return (
    <Dialog
      className={styles["dialog"]}
      classes={{ paper: styles["dialog-paper"] }}
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogContent>
        <DialogContentText className={styles["dialog-content-text"]}>Créer un nouveau / nouvelle participant·e</DialogContentText>
        <TextField
          autoFocus
          className={styles["dialog-input"]}
          margin="dense"
          id="username"
          label="Prénom"
          type="text"
          variant="standard"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          className={styles["dialog-input"]}
          margin="dense"
          id="email"
          label="Email"
          type="email"
          variant="standard"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          className={styles["dialog-input"]}
          margin="dense"
          id="password"
          label="Mot de passe"
          type="password"
          variant="standard"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
        />
      </DialogContent>

      <DialogActions className={styles["buttons"]}>
        <Button className={`${styles["button"]} ${styles["cancel-button"]}`} onClick={onClose}>
          Annuler
        </Button>
        <Button className={`${styles["button"]} ${styles["confirm-button"]}`} onClick={handleConfirm}>
          Créer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserDialog;
