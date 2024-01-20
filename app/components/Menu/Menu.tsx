"use client";

import styles from "./Menu.module.scss";
import { useAuth } from "@/app/hook/useAuth";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

export default function Menu() {
  const pathname = usePathname();
  const isAdminPage = pathname.includes("/admin");
  const { logout } = useAuth();
  const { userState } = useUser();

  return (
    <div className={styles["content"]}>
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
      <div
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
      </div>
    </div>
  );
}
