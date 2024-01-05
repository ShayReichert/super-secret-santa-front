"use client";

import { useState, useEffect } from "react";
import styles from "./LoginForm.module.scss";
import { Titan_One } from "next/font/google";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

export default function LoginForm() {
  const [inputs, setInputs] = useState({
    userName: "",
    password: "",
  });

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  // Disabled button if some input are empty
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (inputs.userName && inputs.password) {
      return setDisabled(false);
    }

    setDisabled(true);
  }, [inputs]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // HoneyPot
    const honeypot = (e.target as HTMLFormElement).querySelector('[name="bot-field"]') as HTMLInputElement;

    if (honeypot && honeypot.value) {
      return;
    }

    console.log(inputs);
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
          {/* TODO : Errors gestions */}
          <div className={styles["form-group"]}>
            <input
              type="text"
              className=""
              placeholder="Ton prénom"
              name="userName"
              value={inputs.userName}
              onChange={handleChangeInput}
              autoComplete="username"
            />
            <input type="password" className="" placeholder="Ton code secret" name="password" value={inputs.password} onChange={handleChangeInput} />
          </div>
          <button className={styles["button"]} disabled={disabled} type="submit">
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
}
