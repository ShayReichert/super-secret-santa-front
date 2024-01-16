import styles from "./ConfirmationDialog.module.scss";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Titan_One } from "next/font/google";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

export default function ConfirmationDialog({ text, open, onClose, onConfirm }: DeleteDialogProps) {
  return (
    <Dialog
      className={styles["dialog"]}
      classes={{ paper: styles["dialog-paper"] }}
      disableScrollLock={true}
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className={`${styles["dialog-title"]} ${titan_one.className}`} id="alert-dialog-title">
        {"Attention"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText className={styles["dialog-content-text"]} id="alert-dialog-description">
          <span>{text}</span>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button className={`${styles["button"]} ${styles["confirm-button"]}`} onClick={onConfirm} color="primary" autoFocus>
          OUI, SUPPRIMER
        </Button>
        <Button className={`${styles["button"]} ${styles["cancel-button"]}`} onClick={onClose}>
          NE PAS SUPPRIMER
        </Button>
      </DialogActions>
    </Dialog>
  );
}
