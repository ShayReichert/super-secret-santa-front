import styles from "./Loading.module.scss";

const Loading = () => {
  return (
    <main id="main" className={styles["main"]}>
      <div className={styles["loading"]}>
        <div className={styles["spinner"]}></div>
      </div>
    </main>
  );
};

export default Loading;
