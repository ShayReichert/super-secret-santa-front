import SantaImage from "./components/SantaImage/SantaImage";
import styles from "./styles/not-found.module.scss";
import { Titan_One } from "next/font/google";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

export default function NotFound() {
  return (
    <main id="main" className={styles["not-found"]}>
      {/* Image wrapper */}
      {/* IMAGE */}
      <div className={styles["content"]}>
        <h1 className={titan_one.className}>404</h1>
        <p>Oups, cette page n'existe pas !</p>
      </div>
      <SantaImage />
    </main>
  );
}
