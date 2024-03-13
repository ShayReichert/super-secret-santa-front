"use client";

import { useEffect, useState } from "react";
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
import { extractUsers } from "@/app/services/eventsFilter";
import { useUser } from "@/app/context/UserContext";
import { useEvents } from "@/app/hook/useEvents/useEvents";

interface AddUsersDialoggProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedUserIds: number[]) => void;
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

function getStyles(username: string, userName: readonly string[], theme: Theme) {
  return {
    fontWeight: userName.indexOf(username) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

const AddUsersDialog = ({ open, onClose, onConfirm }: AddUsersDialoggProps) => {
  const theme = useTheme();
  const [userName, setUserName] = useState<string[]>([]);
  const { userState, isAdministrator, currentEventId } = useUser();
  const { getEvents } = useEvents();
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventsAndUsers = async () => {
      setIsLoading(true);
      try {
        const fetchedEvents = await getEvents();
        if (fetchedEvents && currentEventId !== undefined) {
          const fetchedUsers = extractUsers(fetchedEvents, currentEventId, userState.data?.organizedEventIds, isAdministrator);
          setUsers(fetchedUsers);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des événements ou des utilisateurs", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userState.data?.events) {
      fetchEventsAndUsers();
    }
  }, [userState.data?.events, currentEventId, isAdministrator]);

  const handleChange = (event: SelectChangeEvent<typeof userName>) => {
    const {
      target: { value },
    } = event;
    setUserName(typeof value === "string" ? value.split(",") : value);
  };

  const handleConfirm = () => {
    const selectedUserIds: number[] = [];

    userName.forEach((selectedUsername) => {
      const user = users.find((user) => user.username === selectedUsername);
      if (user) {
        selectedUserIds.push(user.id);
      }
    });

    onConfirm(selectedUserIds);
    onClose();
  };

  if (!open) {
    return null;
  }

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Dialog
      className={styles["dialog"]}
      classes={{ paper: styles["dialog-paper"] }}
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      {users.length > 0 ? (
        <>
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
                value={userName}
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
                {users.map((user) => (
                  <MenuItem
                    className={styles["multiple-chip-menu-item"]}
                    key={user.id}
                    value={user.username}
                    style={getStyles(user.username, userName, theme)}
                  >
                    {user.username}
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
              Ajouter
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogContent>
            <div>Aucun participant déjà existant ne peut être ajouté à cet évènement ! </div>
            <br />
            <div>
              <small>Tu peux cependant "Créer un·e nouvelle participant·e"</small>
            </div>
          </DialogContent>
          <DialogActions className={styles["buttons"]}>
            <Button className={`${styles["button"]} ${styles["cancel-button"]}`} onClick={onClose}>
              Annuler
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default AddUsersDialog;
