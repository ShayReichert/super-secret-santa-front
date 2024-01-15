import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../services/axiosInstance";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { useUser } from "@/app/context/UserContext";

interface AuthState {
  errorMessage: string;
}

export const useAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    errorMessage: "",
  });
  const { setUserState } = useUser();

  const isLoggedIn = () => {
    return !!getCookie("jwt_token");
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post("api/login_check", {
        username: username,
        password: password,
      });
      const { token } = response.data;

      setCookie("jwt_token", token, {
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
        sameSite: "strict",
        // TODO : en prod, ajouter d'autres options de sécurité si nécessaire, par exemple :
        // secure: true, // Assurez-vous que le cookie est transmis uniquement via HTTPS
      });

      await fetchUserData();

      router.push("/dashboard");
    } catch (error) {
      console.error("Erreur de connexion", error);
      setAuthState({
        errorMessage: "Échec de la connexion : Vérifiez vos identifiants.",
      });
    }
  };

  const fetchUserData = async () => {
    const jwt = getCookie("jwt_token");
    if (jwt) {
      const response = await axiosInstance.get("api/user");
      setUserState({ data: response.data, loading: false, error: null });
    }
  };

  const logout = () => {
    deleteCookie("jwt_token");
    setUserState({ data: null, loading: false, error: null });
    router.push("/login");
  };

  return { authState, isLoggedIn, login, logout };
};
