"use client";

import { useState } from "react";
import styles from "./LoginWrapper.module.scss";
import { Titan_One } from "next/font/google";
import LoginForm from "../LoginForm/LoginForm";
import RequestReset from "../RequestReset/RequestReset";
import ConfirmReset from "../ConfirmReset/ConfirmReset";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

export default function LoginWrapper() {
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

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
          <ConfirmReset
            email={email}
            onBack={() => {
              setResetPasswordMode(false);
              setEmailSent(false);
            }}
          />
        ) : resetPasswordMode ? (
          <RequestReset
            onEmailSent={() => {
              setEmailSent(true);
            }}
            onCancel={() => setResetPasswordMode(false)}
            setEmail={setEmail}
          />
        ) : (
          <LoginForm onForgotPassword={() => setResetPasswordMode(true)} />
        )}
      </div>
    </div>
  );
}
