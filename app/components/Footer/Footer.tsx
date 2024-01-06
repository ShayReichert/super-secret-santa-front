import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles["footer"]}>
      <div className={styles["menu"]}>
        <div className={styles["user"]}>
          <span className={styles["user-icon"]}>
            <span className={styles["user-letter"]}>N</span>
          </span>
          <span className={styles["user-name"]}>Nicole</span>
        </div>
        <div className={styles["log"]}>Se déconnecter</div>
      </div>
      <div>© {new Date().getFullYear()} </div>
      <div>Alexis et Shay</div>
    </footer>
  );
}
