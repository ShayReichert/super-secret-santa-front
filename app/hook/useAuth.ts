import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { setCookie } from "cookies-next";

interface AuthState {
  errorMessage: string;
}

export const useAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    errorMessage: "",
  });

  const login = async (userName: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:8080/api/login_check", {
        username: userName,
        password: password,
      });
      const { token } = response.data;

      setCookie("jwt_token", token, {
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
        // TODO : en prod, ajouter d'autres options de sécurité si nécessaire, par exemple :
        // secure: true, // Assurez-vous que le cookie est transmis uniquement via HTTPS
        // sameSite: "strict", // Contrôle l'envoi du cookie avec les requêtes cross-site
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Erreur de connexion", error);
      setAuthState({
        errorMessage: "Échec de la connexion : Vérifiez vos identifiants.",
      });
    }
  };

  return { authState, login };
};
