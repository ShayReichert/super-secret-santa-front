import styles from "./ConfirmReset.module.scss";

interface Props {
  email: string;
  onBack: () => void;
}

export default function ConfirmReset({ email, onBack }: Props) {
  return (
    <div className={styles["confirm-password"]}>
      <p className={styles["text"]}>Un lien de réinitialisation a été envoyé à l'adresse "{email}".</p>
      <button className={styles["button"]} onClick={onBack}>
        Retour à la connexion
      </button>
    </div>
  );
}
