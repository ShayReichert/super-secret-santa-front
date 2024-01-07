"use client";

import styles from "./Footer.module.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();
  const isAdminPage = pathname.includes("/admin");

  return (
    <footer className={`${styles["footer"]} ${isAdminPage ? styles["footer-admin"] : ""}`}>
      <div className={styles["menu-desktop"]}>
        <Link href="/admin">
          <div className={styles["admin"]}>Admin</div>
        </Link>
      </div>

      <div className={styles["menu-mobile"]}>
        <div className={styles["user"]}>
          <span className={`${styles["user-icon"]} ${isAdminPage ? styles["user-icon-admin"] : ""}`}>
            <span className={styles["user-letter"]}>N</span>
          </span>
          <span className={styles["user-name"]}>Nicole</span>
        </div>
        <Link href="/admin">
          <div className={styles["admin"]}>Admin</div>
        </Link>
        <div className={styles["log"]}>Se déconnecter</div>
      </div>

      <div>© {new Date().getFullYear()} </div>
      <div>Alexis et Shay</div>
    </footer>
  );
}
