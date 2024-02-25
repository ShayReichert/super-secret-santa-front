"use client";

import styles from "./Header.module.scss";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/hook/useAuth/useAuth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Titan_One } from "next/font/google";
import MenuUser from "../MenuUser/MenuUser";
import MenuEvents from "../MenuEvents/MenuEvents";
import { useUser } from "@/app/context/UserContext";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

export default function Header() {
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
    <>
      <header className={`${styles["header"]} ${isAdminPage ? styles["header-admin"] : isOrganizerPage ? styles["header-organizer"] : ""}`}>
        {isMounted && isLoggedIn() && (
          <div className={styles["menu-events"]}>
            <MenuEvents />
          </div>
        )}

        <Link className={styles["title"]} href="/">
          <h1 className={titan_one.className}>
            <span>Super</span>
            🎄 Secret Santa 🎄
          </h1>
        </Link>

        {isMounted && isLoggedIn() && (
          <div className={styles["menu"]}>
            <MenuUser />
          </div>
        )}
      </header>

      <div className={styles["menu-events-mobile"]}>
        <MenuEvents />
      </div>
    </>
  );
}
