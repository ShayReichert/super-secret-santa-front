"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "next/link";
import styles from "./CreateUserDialog.module.scss";
import { isPasswordComplex, isValidEmail } from "@/app/services/inputValidator";
import Image from "next/image";

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (newUser: NewUser) => void;
  initialEmail?: string;
}

const CreateUserDialog = ({ open, onClose, onConfirm, initialEmail }: CreateUserDialogProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUserCreated, setIsUserCreated] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [consent, setConsent] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!username.trim()) newErrors.username = "Le prénom ne peut pas être vide.";
    if (!email.trim()) newErrors.email = "L'email ne peut pas être vide.";
    else if (!isValidEmail(email)) newErrors.email = "Le format de l'email n'est pas valide.";
    if (!password.trim()) newErrors.password = "Le mot de passe ne peut pas être vide.";
    else if (!isPasswordComplex(password)) newErrors.password = "Le mot de passe doit faire au moins 8 caractères de chiffres ET de lettres.";
    if (!consent) newErrors.consent = "Vous devez accepter les conditions d'utilisation et la politique de confidentialité.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (validateForm()) {
      try {
        await onConfirm({ username, email, password });
        setIsUserCreated(true);
      } catch (error: any) {
        console.error("Erreur lors de la création de l'utilisateur", error);
        if (error.message === "Le nom ou l'email existe déjà !") {
          setErrors({ email: "Cet email est déjà utilisé." });
        } else {
          setErrors({ form: "Échec lors de la création du compte, veuillez réessayer." });
        }
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
  };

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConsent(false);
    setErrors({});
    setIsUserCreated(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      className={styles["dialog"]}
      classes={{ paper: styles["dialog-paper"] }}
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      {isUserCreated ? (
        <DialogContent>
          <DialogContentText className={styles["dialog-content-text"]}>
            Le compte a bien été créé !<br />
            <small>Un message de confirmation a été envoyé par mail</small>
          </DialogContentText>
          <DialogActions className={styles["buttons"]}>
            <Button className={styles["button"]} onClick={handleClose}>
              OK
            </Button>
          </DialogActions>
        </DialogContent>
      ) : (
        <>
          <DialogContent>
            <DialogContentText className={styles["dialog-content-text"]}>Création d'un nouveau compte</DialogContentText>
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
              type={showPassword ? "text" : "password"}
              variant="standard"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={togglePasswordVisibility}>
                      {showPassword ? (
                        <Image
                          className={styles["visibility-off"]}
                          src="/icons/visibility-off.svg"
                          alt="Cacher le mot de passe"
                          height={20}
                          width={20}
                          priority
                        />
                      ) : (
                        <Image
                          className={styles["visibility"]}
                          src="/icons/visibility.svg"
                          alt="Voir le mot de passe"
                          height={20}
                          width={20}
                          priority
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {pathname.includes("/admin") && (
              <div className={styles["admin-warning"]}>
                <p>
                  Attention, si tu crées ce compte pour quelqu'un, veille bien à lui transmettre ses identifiants (email et mot de passe) :{" "}
                  <Button onClick={copyToClipboard} className={styles["copy-button"]}>
                    Copier le mot de passe
                  </Button>
                </p>
              </div>
            )}
            <FormControlLabel
              control={<Checkbox checked={consent} onChange={(e) => setConsent(e.target.checked)} />}
              label={
                <>
                  J'accepte les{" "}
                  <Link className={styles["legals-link"]} href="/mentions-legales#consent" target="_blank">
                    conditions d'utilisation et la politique de confidentialité
                  </Link>
                </>
              }
            />
            {errors.consent && <DialogContentText color="error">{errors.consent}</DialogContentText>}
          </DialogContent>
          <DialogActions className={styles["buttons"]}>
            <Button className={`${styles["button"]} ${styles["cancel-button"]}`} onClick={onClose}>
              Annuler
            </Button>
            <Button className={`${styles["button"]} ${styles["confirm-button"]}`} onClick={handleConfirm}>
              Créer
            </Button>
          </DialogActions>
          {errors.form && <DialogContentText color="error">{errors.form}</DialogContentText>}
        </>
      )}
    </Dialog>
  );
};

export default CreateUserDialog;
