"use client";

import { useState, useEffect } from "react";
import styles from "./LoginForm.module.scss";
import { Titan_One } from "next/font/google";
import { useAuth } from "@/app/hook/useAuth/useAuth";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

export default function LoginForm() {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const { authState, login } = useAuth();

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const [disabledButton, setDisabledButton] = useState(true);

  useEffect(() => {
    setDisabledButton(!(inputs.username && inputs.password));
  }, [inputs]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const honeypot = (e.target as HTMLFormElement).querySelector('[name="bot-field"]') as HTMLInputElement;
    if (honeypot && honeypot.value) return;

    await login(inputs.username, inputs.password);
  };

  return (
    <div className={styles["login-form-wrapper"]}>
      <div className={styles["login-form"]}>
        <div className={styles["text"]}>
          <h2 className={titan_one.className}>OH OH OHHH !</h2>
          <p>Mais qui es-tu ?</p>
        </div>
        <form className={styles["form"]} onSubmit={handleSubmit}>
          <p className={styles["hidden"]}>
            <label>
              <input name="bot-field" autoComplete="new-password" tabIndex={-1} />
            </label>
          </p>
          <div className={styles["form-group"]}>
            <input
              type="text"
              className=""
              placeholder="Ton prénom"
              name="username"
              value={inputs.username}
              onChange={handleChangeInput}
              autoComplete="username"
            />
            <input type="password" className="" placeholder="Ton code secret" name="password" value={inputs.password} onChange={handleChangeInput} />
            {authState.errorMessage && <p className={styles["error-message"]}>{authState.errorMessage}</p>}
          </div>
          <button className={styles["button"]} disabled={disabledButton} type="submit">
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
}
