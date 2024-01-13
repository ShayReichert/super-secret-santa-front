import styles from "./Loader.module.scss";

const Loader = () => {
  return (
    <main id="main" className={styles["main"]}>
      <div className={styles["loader"]}>
        <div className={styles["spinner"]}></div>
      </div>
    </main>
  );
};

export default Loader;
