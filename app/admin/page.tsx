import type { Metadata } from "next";
import AdminUserList from "./components/AdminUserList/AdminUserList";
import SantaImage from "../components/SantaImage/SantaImage";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Admin | Super Secret Santa",
  description: "Gestion des comptes utilisateurs",
};

export default function Admin() {
  return (
    <main id="main" className={styles["main"]}>
      <AdminUserList />
      <SantaImage />
    </main>
  );
}
