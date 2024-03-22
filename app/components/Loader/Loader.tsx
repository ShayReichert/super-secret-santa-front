import styles from "./Loader.module.scss";

const Loader = () => {
  return (
    <main id="main" className={styles["main"]}>
      <div className={styles["loader"]} data-testid="loader">
        <div className={styles["spinner"]} data-testid="spinner"></div>
      </div>
    </main>
  );
};

export default Loader;
