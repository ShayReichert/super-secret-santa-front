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

export default function MenuUser({ isAdminPage, isOrganizerPage }: { isAdminPage?: boolean; isOrganizerPage?: boolean }) {
  const { logout } = useAuth();
  const { userState, isAdministrator, canOnlyManageEvent } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
        <MenuItem>📆 Créer un nouvel événement</MenuItem>

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
