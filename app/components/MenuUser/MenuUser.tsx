"use client";

import styles from "./MenuUser.module.scss";
import { useState } from "react";
import { useAuth } from "@/app/hook/useAuth/useAuth";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

export default function MenuUser() {
  const pathname = usePathname();
  const isAdminPage = pathname.includes("/admin");
  const { logout } = useAuth();
  const { userState } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isAdministrator = userState.data?.roles.includes("ROLE_ADMIN");
  const canOnlyManageEvent = userState.data?.isOrganizerOfEvent && !isAdministrator;

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
          <span className={`${styles["user-icon"]} ${isAdminPage ? styles["user-icon-admin"] : ""}`} data-testid="user-icon">
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
        className={`${styles["menu-open-events"]} ${isAdminPage ? styles["menu-open-events-admin"] : ""}`}
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
