"use client";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import styles from "./OrganizerDialog.module.scss";
import { DialogTitle } from "@mui/material";
import { Titan_One } from "next/font/google";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

interface OrganizerDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  isAdministrator: boolean;
}

const OrganizerDialog = ({ open, onClose, onConfirm, userName, isAdministrator }: OrganizerDialogProps) => {
  const dialogText = isAdministrator
    ? `Veux-tu vraiment attribuer la gestion de l'évènement à ${userName} ?`
    : `Tu ne pourras plus gérer cet évènement si tu attribues la gestion à ${userName}. Veux-tu continuer ?`;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      className={styles["dialog"]}
      classes={{ paper: styles["dialog-paper"] }}
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogTitle className={`${styles["dialog-title"]} ${titan_one.className}`}>Attention</DialogTitle>
        <DialogContentText className={styles["dialog-content-text"]} id="alert-dialog-description">
          {dialogText}
        </DialogContentText>
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

export default OrganizerDialog;
