import type { Metadata } from "next";
import styles from "./page.module.scss";
import LoginWrapper from "./components/LoginWrapper/LoginWrapper";
import SantaImage from "../components/SantaImage/SantaImage";

export const metadata: Metadata = {
  title: "Connexion | Super Secret Santa",
  description: "Connecte-toi à ton compte",
};

export default function Login() {
  return (
    <main id="main" className={styles["main"]}>
      <LoginWrapper />
      <SantaImage />
    </main>
  );
}
