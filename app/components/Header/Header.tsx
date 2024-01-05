import styles from "./Header.module.scss";
import { Titan_One } from "next/font/google";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

export default function Header() {
  return (
    <header className={styles["header"]}>
      <div className={styles["left-space"]}></div>
      <h1 className={titan_one.className}>
        <span>Super</span>
        🎄 Secret Santa 🎄
      </h1>
      <div className={styles["log"]}>Se déconnecter</div>
    </header>
  );
}
