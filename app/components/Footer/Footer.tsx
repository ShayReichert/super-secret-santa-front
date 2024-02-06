"use client";

import styles from "./Footer.module.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Menu from "../Menu/Menu";
import { useUser } from "@/app/context/UserContext";
import MenuEvents from "../MenuEvents/MenuEvents";

export default function Footer() {
  const pathname = usePathname();
  const isAdminPage = pathname.includes("/admin");
  const { userState } = useUser();

  return (
    <footer className={`${styles["footer"]} ${isAdminPage ? styles["footer-admin"] : ""}`}>
      <div className={styles["menu-mobile"]}>
        <div className={styles["menu-events-mobile"]}>
          <MenuEvents />
        </div>
        <Menu />
      </div>

      <div className={styles["menu-desktop"]}>
        {userState.data && userState.data.roles.includes("ROLE_ADMIN") && !isAdminPage && (
          <div className={styles["admin"]}>
            <Link href="/admin">📊 Accès admin</Link>
          </div>
        )}
      </div>

      <div>© {new Date().getFullYear()} </div>
      <div>Alexis et Shay</div>
    </footer>
  );
}
