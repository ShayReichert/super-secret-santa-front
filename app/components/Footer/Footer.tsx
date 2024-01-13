"use client";

import styles from "./Footer.module.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Menu from "../Menu/Menu";

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
        <Menu />
      </div>

      <div>© {new Date().getFullYear()} </div>
      <div>Alexis et Shay</div>
    </footer>
  );
}
