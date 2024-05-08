import { useState, useEffect } from "react";
import { useResetPassword } from "@/app/hook/useResetPassword/useResetPassword";
import styles from "./RequestReset.module.scss";

interface Props {
  onEmailSent: () => void;
  onCancel: () => void;
  setEmail: (email: string) => void;
}

export default function RequestReset({ onEmailSent, onCancel, setEmail }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [disabledButton, setDisabledButton] = useState(true);
  const { requestPasswordReset } = useResetPassword();
  const [email, setEmailLocal] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setDisabledButton(!email);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      setEmail(email);
      onEmailSent();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <form className={styles["form"]} onSubmit={handleSubmit}>
      <div className={styles["form-group"]}>
        <input
          type="email"
          placeholder="Ton e-mail"
          value={email}
          onChange={(e) => {
            setEmailLocal(e.target.value);
          }}
        />
        <button className={styles["button"]} disabled={disabledButton || isLoading} type="submit">
          {isLoading ? "Envoi en cours..." : "Réinitialiser mon mot de passe"}
        </button>
        {errorMessage && <p className={styles["error-message"]}>{errorMessage}</p>}
        <p className={styles["cancel-password"]}>
          <a href="#" onClick={onCancel}>
            Annuler
          </a>
        </p>
      </div>
    </form>
  );
}
