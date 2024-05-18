import { useState, useRef } from "react";
import styles from "./MenuListAdmin.module.scss";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Image from "next/image";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";

interface Props {
  onRenameEvent: () => void;
  onDeleteEvent: () => void;
  onCreateUser: () => void;
  onAddUsers: () => void;
  onPerformDraw: () => void;
  drawState: { isLoading: boolean; error: string; successMessage: string };
}

export default function MenuListAdmin({ onRenameEvent, onDeleteEvent, onCreateUser, onAddUsers, onPerformDraw, drawState }: Props) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Tab" || event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div className={styles["menu"]}>
      <Tooltip title="Gérer l'évènement">
        <Button
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? "composition-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <Image className={styles["dots-icon"]} src="/icons/dots.svg" alt="Menu admin" height={26} width={26} priority />
        </Button>
      </Tooltip>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} placement="bottom-start" transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="composition-menu" aria-labelledby="composition-button" onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={onAddUsers}>Ajouter des participant·es</MenuItem>
                  <MenuItem onClick={onCreateUser}>Créer un·e nouvelle participant·e</MenuItem>
                  <Divider component="li" />
                  <MenuItem onClick={onRenameEvent}>Modifier le nom de cet évènement</MenuItem>
                  {drawState.isLoading ? (
                    <MenuItem disabled>Chargement...</MenuItem>
                  ) : drawState.error ? (
                    <MenuItem disabled>Erreur : {drawState.error}</MenuItem>
                  ) : drawState.successMessage ? (
                    <MenuItem disabled>{drawState.successMessage} !</MenuItem>
                  ) : (
                    <MenuItem onClick={onPerformDraw}>Faire le tirage au sort</MenuItem>
                  )}
                  <Divider component="li" />
                  <MenuItem onClick={onDeleteEvent}>Supprimer cet évènement</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}
