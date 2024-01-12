"use client";

import styles from "./Header.module.scss";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/hook/useAuth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Titan_One } from "next/font/google";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

export default function Header() {
  const pathname = usePathname();
  const isAdminPage = pathname.includes("/admin");
  const [isMounted, setIsMounted] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    // Wait for the component to be mounted to be able to use the isLoggedIn function
    setIsMounted(true);
  }, []);

  return (
    <header className={`${styles["header"]} ${isAdminPage ? styles["header-admin"] : ""}`}>
      {isMounted && isLoggedIn() && <div className={styles["left-space"]}></div>}
      <Link className={styles["title"]} href="/">
        <h1 className={titan_one.className}>
          <span>Super</span>
          🎄 Secret Santa 🎄
        </h1>
      </Link>

      {isMounted && isLoggedIn() && (
        <div className={styles["menu"]}>
          <div className={styles["content"]}>
            <div className={styles["user"]}>
              <span className={`${styles["user-icon"]} ${isAdminPage ? styles["user-icon-admin"] : ""}`}>
                <span className={styles["user-letter"]}>N</span>
              </span>
              <span className={styles["user-name"]}>Nicole</span>
            </div>
            <div className={styles["log"]} onClick={logout}>
              Se déconnecter
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
