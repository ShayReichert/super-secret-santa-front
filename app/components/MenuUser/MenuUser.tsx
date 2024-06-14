"use client";

import styles from "./MenuUser.module.scss";
import { useState } from "react";
import { useAuth } from "@/app/hook/useAuth/useAuth";
import { useUserAccount } from "@/app/hook/useUserAccount/useUserAccount";
import { useUser } from "@/app/context/UserContext";
import { useCreateEvent } from "@/app/hook/useCreateEvent/useCreateEvent";
import Link from "next/link";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import NewEventDialog from "../NewEventDialog/NewEventDialog";
import UserAccountDialog from "../UserAccountDialog/UserAccountDialog";

export default function MenuUser({ isAdminPage, isOrganizerPage }: { isAdminPage?: boolean; isOrganizerPage?: boolean }) {
  const { logout } = useAuth();
  const { deleteAccount, updatePseudo } = useUserAccount();
  const { userState, isAdministrator, canOnlyManageEvent } = useUser();
  const { isEventDialogOpen, handleCreateEvent, handleCreateEventConfirm, setIsEventDialogOpen } = useCreateEvent();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const openUserAccount = () => {
    setIsAccountDialogOpen(true);
  };

  const handleCloseAccountDialog = () => {
    setIsAccountDialogOpen(false);
    setErrorMessage("");
  };

  const handleUserUpdate = async (user: any) => {
    const response = await updatePseudo(user.id, user.pseudo);
    if (response === undefined) {
      setErrorMessage("Erreur lors de la mise à jour du pseudo");
    } else if (response.id) {
      handleCloseAccountDialog();
    }
  };

  const handleUserDelete = async (id: string) => {
    const response = await deleteAccount();
    if (response === "Vous êtes organisateur d'un évènement, merci de changer l'organisateur") {
      setErrorMessage("Vous êtes organisateur·ice d'un évènement, merci de changer l'organisateur·ice avant de supprimer votre compte.");
    } else {
      handleCloseAccountDialog();
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
        data-testid="menu-button"
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
              {isOrganizerPage ? <Link href="/dashboard">🏠 Retour au dashboard</Link> : <Link href="/admin">📜 Gérer mes évènements</Link>}
            </MenuItem>
          </div>
        )}

        <div>
          <Divider />
          <MenuItem
            className={styles["log"]}
            onClick={openUserAccount}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openUserAccount();
            }}
            role="button"
            tabIndex={0}
            aria-label="Mon compte"
            data-testid="account-button"
          >
            Mon compte
          </MenuItem>
        </div>

        <UserAccountDialog
          open={isAccountDialogOpen}
          onClose={handleCloseAccountDialog}
          user={userState.data}
          onUpdate={handleUserUpdate}
          onDelete={handleUserDelete}
          errorMessage={errorMessage}
        />

        <div>
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
        </div>
      </Menu>
    </div>
  );
}
