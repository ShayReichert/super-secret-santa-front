"use client";

import styles from "./Header.module.scss";
import { Titan_One } from "next/font/google";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/hook/useAuth";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

export default function Header() {
  const pathname = usePathname();
  const isAdminPage = pathname.includes("/admin");
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className={`${styles["header"]} ${isAdminPage ? styles["header-admin"] : ""}`}>
      {isLoggedIn() && <div className={styles["left-space"]}></div>}
      <Link className={styles["title"]} href="/">
        <h1 className={titan_one.className}>
          <span>Super</span>
          🎄 Secret Santa 🎄
        </h1>
      </Link>

      {isLoggedIn() && (
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
