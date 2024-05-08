"use client";

import styles from "./page.module.scss";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useResetPassword } from "@/app/hook/useResetPassword/useResetPassword";
import { Titan_One } from "next/font/google";
import SantaImage from "../../components/SantaImage/SantaImage";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const token = params.token;
  const { verifyResetToken, resetPassword } = useResetPassword();
  const [tokenValid, setTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      if (typeof token === "string") {
        try {
          const result = await verifyResetToken(token);
          setTokenValid(true);
        } catch (error) {
          alert(error);
          router.push("/login");
        }
        setIsLoading(false);
      }
    };

    if (token) {
      checkToken();
    }
  }, [token, verifyResetToken, router]);

  const handleResetPassword = async () => {
    if (password && typeof token === "string") {
      try {
        const message = await resetPassword(token, password);
        alert(message);
        router.push("/login");
      } catch (error) {
        alert(error);
      }
    }
  };

  if (isLoading) {
    return (
      <main className={`${styles["main"]} ${styles["loading"]}`}>
        <div>Chargement... </div>
      </main>
    );
  }

  return (
    <main id="main" className={styles["main"]}>
      <div className={styles["reset-form-wrapper"]}>
        <div className={styles["reset-form"]}>
          <h2 className={titan_one.className}>Création d'un nouveau mot de passe</h2>
          {tokenValid && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleResetPassword();
              }}
            >
              <div className={styles["form-group"]}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entre ton nouveau mot de passe"
                  required
                />
                <button type="submit">Sauvegarder</button>
              </div>
            </form>
          )}
        </div>
      </div>

      <SantaImage />
    </main>
  );
}
