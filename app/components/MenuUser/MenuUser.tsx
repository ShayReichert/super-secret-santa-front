"use client";

import styles from "./MenuUser.module.scss";
import { useState } from "react";
import { useAuth } from "@/app/hook/useAuth/useAuth";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import NewEventDialog from "../NewEventDialog/NewEventDialog";
import { useEvents } from "@/app/hook/useEvents/useEvents";
import { setCookie } from "cookies-next";
import { cookieParams } from "@/app/services/cookieParams";

export default function MenuUser({ isAdminPage, isOrganizerPage }: { isAdminPage?: boolean; isOrganizerPage?: boolean }) {
  const { createEvent, setUserToEvent } = useEvents();
  const { logout } = useAuth();
  const { userState, isAdministrator, canOnlyManageEvent } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleCreateEvent = () => {
    setIsEventDialogOpen(true);
  };

  const handleCreateEventConfirm = async (newEventName: string) => {
    try {
      const newEvent = await createEvent(newEventName);

      if (newEvent && newEvent.id) {
        const userId = userState.data?.id;

        if (userId) {
          await setUserToEvent(newEvent.id, userId);
        } else {
          console.error("Erreur: ID utilisateur non trouvé.");
        }

        setIsEventDialogOpen(false);
        setAnchorEl(null);
        setCookie("selectedEventId", newEvent.id.toString(), cookieParams);
        // TODO : improve update of events in menu ?
        window.location.href = "/admin";
      } else {
        console.error("Erreur lors de la création de l'événement", newEventName);
      }
    } catch (error) {
      console.error("Erreur lors de la création ou de l'ajout de l'organisateur à l'événement", error);
    }
  };

  return (
    <div className={styles["content"]}>
      <Button
        id="basic-button"
        className={styles["button-events"]}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
      >
        <div className={styles["user"]}>
          <span
            className={`${styles["user-icon"]} ${isAdminPage ? styles["user-icon-admin"] : isOrganizerPage ? styles["user-icon-organizer"] : ""}`}
            data-testid="user-icon"
          >
            <span className={styles["user-letter"]} data-testid="user-letter">
              {userState.data?.userName?.charAt(0)}
            </span>
          </span>
          <span className={styles["user-name"]} data-testid="user-name">
            {userState.data?.userName}
          </span>
        </div>
      </Button>
      <Menu
        id="basic-menu"
        className={`${styles["menu-open-events"]} ${
          isAdminPage ? styles["menu-open-events-admin"] : isOrganizerPage ? styles["menu-open-events-organizer"] : ""
        }`}
        anchorEl={anchorEl}
        disableScrollLock={true}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem>
          <a onClick={handleCreateEvent} aria-label="Créer un nouvel évènement">
            📆 Créer un nouvel événement
          </a>
        </MenuItem>

        <NewEventDialog open={isEventDialogOpen} onClose={() => setIsEventDialogOpen(false)} onConfirm={handleCreateEventConfirm} />

        {userState.data && isAdministrator && (
          <div>
            <Divider />
            <MenuItem onClick={() => setAnchorEl(null)}>
              {isAdminPage ? <Link href="/dashboard">🏠 Retour au dashboard</Link> : <Link href="/admin">📊 Accès admin</Link>}
            </MenuItem>
          </div>
        )}

        {userState.data && canOnlyManageEvent && (
          <div>
            <Divider />
            <MenuItem onClick={() => setAnchorEl(null)}>
              {isAdminPage ? <Link href="/dashboard">🏠 Retour au dashboard</Link> : <Link href="/admin">📜 Gérer mes évènements</Link>}
            </MenuItem>
          </div>
        )}

        <Divider />
        <MenuItem
          className={styles["log"]}
          onClick={logout}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") logout();
          }}
          role="button"
          tabIndex={0}
          aria-label="Se déconnecter"
          data-testid="logout-button"
        >
          Se déconnecter
        </MenuItem>
      </Menu>
    </div>
  );
}
