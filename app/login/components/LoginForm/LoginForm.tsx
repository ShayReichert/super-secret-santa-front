"use client";

import { useState, useEffect } from "react";
import styles from "./LoginForm.module.scss";
import { Titan_One } from "next/font/google";
import { useAuth } from "@/app/hook/useAuth/useAuth";
import { useUserList } from "@/app/hook/useUserList/useUserList";
import CreateUserDialog from "@/app/admin/components/CreateUserDialog/CreateUserDialog";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

export default function LoginForm() {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    email: "",
  });
  const { authState, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [disabledButton, setDisabledButton] = useState(true);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const { createUser } = useUserList();

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (resetPasswordMode) {
      setDisabledButton(!inputs.email);
    } else {
      setDisabledButton(!(inputs.username && inputs.password));
    }
  }, [inputs, resetPasswordMode]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const honeypot = (e.target as HTMLFormElement).querySelector('[name="bot-field"]') as HTMLInputElement;
    if (honeypot && honeypot.value) return;

    setIsLoading(true);
    if (resetPasswordMode) {
      // TODO : Appeler la fonction de réinitialisation de mot de passe ici
      // resetPassword(inputs.email);
      console.log("resetPassword", inputs.email);
      setEmailSent(true);
    } else {
      await login(inputs.username, inputs.password);
    }
    setIsLoading(false);
  };

  const handleOpenCreateUserDialog = () => {
    setIsCreateUserDialogOpen(true);
  };

  const handleCreateUser = async (newUserData: NewUser) => {
    const result = await createUser(newUserData);
    setIsCreateUserDialogOpen(false);
  };

  return (
    <div className={styles["login-form-wrapper"]}>
      <div className={styles["login-form"]}>
        {!resetPasswordMode && !emailSent && (
          <div className={styles["text"]}>
            <h2 className={titan_one.className}>OH OH OHHH !</h2>
            <p>Mais qui es-tu ?</p>
          </div>
        )}
        {emailSent ? (
          <div className={styles["confirm-password"]}>
            <p className={styles["text"]}>Un lien de réinitialisation a été envoyé à l'adresse "{inputs.email}".</p>
            <button
              className={styles["button"]}
              onClick={() => {
                setResetPasswordMode(false);
                setEmailSent(false);
              }}
            >
              Retour à la connexion
            </button>
          </div>
        ) : (
          <form className={styles["form"]} onSubmit={handleSubmit}>
            <p className={styles["hidden"]}>
              <label>
                <input name="bot-field" autoComplete="new-password" tabIndex={-1} />
              </label>
            </p>
            <div className={styles["form-group"]}>
              {resetPasswordMode ? (
                <>
                  <input
                    type="email"
                    className=""
                    placeholder="Ton e-mail"
                    name="email"
                    value={inputs.email}
                    onChange={handleChangeInput}
                    autoComplete="email"
                  />
                  <button className={styles["button"]} disabled={disabledButton || isLoading} type="submit">
                    {isLoading ? "Envoi en cours..." : "Réinitialiser mon mot de passe"}
                  </button>
                  <p className={styles["cancel-password"]}>
                    <a href="#" onClick={() => setResetPasswordMode(false)}>
                      Annuler
                    </a>
                  </p>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    className=""
                    placeholder="Ton prénom"
                    name="username"
                    value={inputs.username}
                    onChange={handleChangeInput}
                    autoComplete="username"
                  />
                  <input
                    type="password"
                    className=""
                    placeholder="Ton code secret"
                    name="password"
                    value={inputs.password}
                    onChange={handleChangeInput}
                  />
                  {authState.errorMessage && <p className={styles["error-message"]}>{authState.errorMessage}</p>}
                  <p className={styles["forgot-password"]}>
                    <a href="#" onClick={() => setResetPasswordMode(true)}>
                      Mot de passe oublié ?
                    </a>
                  </p>
                  <button className={styles["button"]} disabled={disabledButton || isLoading} type="submit">
                    {isLoading ? "Connexion..." : "Connexion"}
                  </button>
                  <p className={styles["create-account"]}>
                    Tu n’as pas de compte ?{" "}
                    <a href="#" onClick={handleOpenCreateUserDialog}>
                      Créer un compte
                    </a>
                  </p>
                  <CreateUserDialog open={isCreateUserDialogOpen} onClose={() => setIsCreateUserDialogOpen(false)} onConfirm={handleCreateUser} />
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
