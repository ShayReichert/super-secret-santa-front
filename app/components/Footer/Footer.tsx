"use client";

import styles from "./Footer.module.scss";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import MenuUser from "../MenuUser/MenuUser";
import { useUser } from "@/app/context/UserContext";
import { useAuth } from "@/app/hook/useAuth/useAuth";
import Link from "next/link";

export default function Footer() {
  const { isAdministrator, canOnlyManageEvent } = useUser();
  const pathname = usePathname();
  const isAdminPage = pathname.includes("/admin") && isAdministrator;
  const isOrganizerPage = pathname.includes("/admin") && canOnlyManageEvent;
  const [isMounted, setIsMounted] = useState(false);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    // Wait for the component to be mounted to be able to use the isLoggedIn function
    setIsMounted(true);
  }, []);

  return (
    <footer className={`${styles["footer"]} ${isAdminPage ? styles["footer-admin"] : isOrganizerPage ? styles["footer-organizer"] : ""}`}>
      {isMounted && isLoggedIn() && (
        <div className={styles["menu-mobile"]}>
          <MenuUser isAdminPage={isAdminPage} isOrganizerPage={isOrganizerPage} />
        </div>
      )}
      <div className={styles["content"]}>
        <div>
          Codé avec ❤️ par{" "}
          <a href="https://github.com/Alexis3386" target="_blank">
            Alexis
          </a>{" "}
          et{" "}
          <a href="https://shayreichert.com/" target="_blank">
            Shay
          </a>
        </div>
        <div className={styles["legals"]}>
          © {new Date().getFullYear()} - <Link href="/mentions-legales">Mentions Légales</Link> -{" "}
          <a href="mailto:shay.reichert.dev@gmail.com">Signaler un bug</a>
        </div>
      </div>
    </footer>
  );
}
