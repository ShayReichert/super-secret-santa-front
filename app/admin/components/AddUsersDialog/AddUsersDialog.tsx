"use client";

import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useEvents } from "@/app/hook/useEvents/useEvents";
import styles from "./AddUsersDialog.module.scss";

interface AddUsersDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (userId: number) => void;
  onCreateUser: (inputValue: string) => void;
}

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

const AddUsersDialog = ({ open, onClose, onConfirm, onCreateUser }: AddUsersDialogProps) => {
  const { getUsersToInvite } = useEvents();
  const [users, setUsers] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsersToInvite();
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (inputValue && emailRegex.test(inputValue)) {
      setIsSearching(true);
      const timeoutId = setTimeout(() => {
        const results = users.filter((user) => user.email.toLowerCase() === inputValue.toLowerCase());
        setOptions(results);
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setOptions([]);
      setIsSearching(false);
    }
  }, [inputValue]);

  const noOptionsText = () => {
    if (inputValue && !isSearching && options.length === 0 && emailRegex.test(inputValue)) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              fontSize: "16px",
              color: "primary",
            }}
          >
            Aucun·e utilisateur·ice trouvé·e.
          </div>
          <Button
            sx={{
              fontSize: "16px",
              color: "primary",
            }}
            onClick={() => onCreateUser(inputValue)}
          >
            Créer un nouveau compte pour {inputValue}
          </Button>
        </div>
      );
    }
    return isSearching ? "Recherche en cours..." : null;
  };

  const handleConfirm = () => {
    if (selectedUser) {
      onConfirm(selectedUser.id);
      alert(`Utilisateur ${selectedUser.username} ajouté avec succès.`);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <>
      <Dialog className={styles["dialog"]} classes={{ paper: styles["dialog-paper"] }} open={open} onClose={onClose}>
        <DialogContent>
          <DialogContentText className={styles["dialog-content-text"]}>Entre l'email du participant·e que tu souhaites ajouter :</DialogContentText>
          <Autocomplete
            className={styles["autocomplete"]}
            value={selectedUser}
            onChange={(event, newValue) => {
              setSelectedUser(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            options={options}
            filterOptions={(options) => options}
            getOptionLabel={(option) => (option ? option.username : "")}
            renderInput={(params) => <TextField {...params} label="Recherche par email" variant="outlined" fullWidth />}
            noOptionsText={noOptionsText()}
          />
        </DialogContent>
        <DialogActions className={styles["buttons"]}>
          <Button className={`${styles["button"]} ${styles["cancel-button"]}`} onClick={onClose}>
            Annuler
          </Button>
          <Button className={`${styles["button"]} ${styles["confirm-button"]}`} onClick={handleConfirm} disabled={!selectedUser}>
            Inviter
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddUsersDialog;
