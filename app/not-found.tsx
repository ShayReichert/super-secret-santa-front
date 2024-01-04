import styles from "./styles/not-found.module.scss";

export default function NotFound() {
  return (
    <main id="main" className={styles["not-found"]}>
      <section>
        <div>
          {/* Image wrapper */}
          {/* IMAGE */}
          <h1>404</h1>
          <p>Oups, cette page n'existe pas !</p>
        </div>
      </section>
    </main>
  );
}
