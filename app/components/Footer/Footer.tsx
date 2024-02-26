"use client";

import styles from "./Footer.module.scss";
import { usePathname } from "next/navigation";
import MenuUser from "../MenuUser/MenuUser";
import { useUser } from "@/app/context/UserContext";

export default function Footer() {
  const { isAdministrator, canOnlyManageEvent } = useUser();
  const pathname = usePathname();
  const isAdminPage = pathname.includes("/admin") && isAdministrator;
  const isOrganizerPage = pathname.includes("/admin") && canOnlyManageEvent;

  return (
    <footer className={`${styles["footer"]} ${isAdminPage ? styles["footer-admin"] : isOrganizerPage ? styles["footer-organizer"] : ""}`}>
      <div className={styles["menu-mobile"]}>
        <MenuUser isAdminPage={isAdminPage} isOrganizerPage={isOrganizerPage} />
      </div>

      <div>© {new Date().getFullYear()} </div>
      <div>Alexis et Shay</div>
    </footer>
  );
}
