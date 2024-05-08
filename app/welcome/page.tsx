import type { Metadata } from "next";
import styles from "./page.module.scss";
import SantaImage from "../components/SantaImage/SantaImage";
import Link from "next/link";
import { Titan_One } from "next/font/google";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "Super Secret Santa",
  description: "Organise facilement tes Pères Noël secret en ligne",
};

export default function Welcome() {
  return (
    <main id="main" className={styles["main"]}>
      <div className={styles["content"]}>
        <h1 className={titan_one.className}>Bienvenue !</h1>
        <div className={styles["text"]}>
          <p>Tu veux organiser un Père Noël secret mais tu ne sais pas comment faire ?</p>
          <ul>
            <li>
              <span>1. Crée un évènement</span>
            </li>
            <li>
              <span>2. Ajoute les participant·es</span>
            </li>
            <li>
              <span>3. Fais le tirage au sort et partage les résultats !</span>
            </li>
          </ul>
          <p> Tu pourras gérer tous tes noëls au même endroit : Noël en famille, entre ami·es, au travail, etc</p>
        </div>

        <Link className={styles["button"]} href="/login">
          Faire un tirage au sort
        </Link>
      </div>
      <SantaImage />
    </main>
  );
}
