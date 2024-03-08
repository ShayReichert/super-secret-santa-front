"use client";

import { useState } from "react";
import styles from "./AddUsersDialog.module.scss";
import { Theme, useTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";

interface AddUsersDialoggProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (Users) => void; // TODO : mettre le bon type quand les users sélectionnés seront les bons
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

const AddUsersDialog = ({ open, onClose, onConfirm }: AddUsersDialoggProps) => {
  const theme = useTheme();
  const [personName, setPersonName] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
  };

  const handleConfirm = () => {
    onConfirm(personName);
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
      <DialogContent>
        <DialogContentText className={styles["dialog-content-text"]}>
          Sélectionne les participant·es que tu souhaites ajouter à l’évènement :
        </DialogContentText>

        <FormControl sx={{ m: 1, width: 400 }}>
          <InputLabel id="multiple-chip-label">Participant·es</InputLabel>
          <Select
            labelId="multiple-chip-label"
            id="multiple-chip"
            className={styles["multiple-chip"]}
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput id="select-multiple-chip" label="Sélectionne les participant·es" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {names.map((name) => (
              <MenuItem className={styles["multiple-chip-menu-item"]} key={name} value={name} style={getStyles(name, personName, theme)}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

export default AddUsersDialog;
