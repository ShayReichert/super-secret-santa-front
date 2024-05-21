"use client";

import styles from "./page.module.scss";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useResetPassword } from "@/app/hook/useResetPassword/useResetPassword";
import { Titan_One } from "next/font/google";
import SantaImage from "../../components/SantaImage/SantaImage";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Image from "next/image";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const token = params.token;
  const { verifyResetToken, resetPassword } = useResetPassword();
  const [tokenValid, setTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
                <TextField
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entre ton nouveau mot de passe"
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility" onClick={togglePasswordVisibility}>
                          {showPassword ? (
                            <Image
                              className={styles["visibility-off"]}
                              src="/icons/visibility-off.svg"
                              alt="Cacher le mot de passe"
                              height={20}
                              width={20}
                              priority
                            />
                          ) : (
                            <Image
                              className={styles["visibility"]}
                              src="/icons/visibility.svg"
                              alt="Voir le mot de passe"
                              height={20}
                              width={20}
                              priority
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <button className={styles["button"]} type="submit">
                  Sauvegarder
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <SantaImage />
    </main>
  );
}
