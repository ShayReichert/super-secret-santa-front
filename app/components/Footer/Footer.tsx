"use client";

import styles from "./Footer.module.scss";
import { usePathname } from "next/navigation";
import MenuUser from "../MenuUser/MenuUser";
import MenuEvents from "../MenuEvents/MenuEvents";

export default function Footer() {
  const pathname = usePathname();
  const isAdminPage = pathname.includes("/admin");

  return (
    <footer className={`${styles["footer"]} ${isAdminPage ? styles["footer-admin"] : ""}`}>
      <div className={styles["menu-mobile"]}>
        <div className={styles["menu-events-mobile"]}>
          <MenuEvents />
        </div>
        <MenuUser />
      </div>

      <div>© {new Date().getFullYear()} </div>
      <div>Alexis et Shay</div>
    </footer>
  );
}
