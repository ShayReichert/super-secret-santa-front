import axiosInstance from "../../services/axiosInstance";
import axios from "axios";

export const useResetPassword = () => {
  const requestPasswordReset = async (email: string): Promise<string> => {
    try {
      const response = await axiosInstance.post("/forgot-password", { email });

      if (response.data === "Un problème est survenu") {
        throw new Error("Email non trouvé.");
      }

      return response.data;
    } catch (error) {
      console.error("Erreur lors de la demande de réinitialisation du mot de passe", error);
      throw new Error("Erreur lors de l'envoi de l'e-mail de réinitialisation.");
    }
  };

  const verifyResetToken = async (token: string): Promise<{ resetToken: string; timeSendResetPasswordLink: string } | string> => {
    try {
      const response = await axiosInstance.post("/reset-password", { token });

      if (response.data === "Utilisateur non trouvé") {
        throw new Error("Utilisateur non trouvé");
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error("Le lien de réinitialisation n'est plus valide ou l'utilisateur n'a pas été trouvé.");
      }
      console.error("Erreur lors de la vérification du token de réinitialisation", error);
      throw new Error("Erreur lors de la vérification du token.");
    }
  };

  const resetPassword = async (token: string, password: string): Promise<string> => {
    try {
      const response = await axiosInstance.post("/reset-password-set", { token, password });

      if (response.data === "Utilisateur non trouvé") {
        throw new Error("Utilisateur non trouvé");
      }

      return response.data;
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe", error);
      throw new Error("Erreur lors de la réinitialisation du mot de passe.");
    }
  };

  return { requestPasswordReset, verifyResetToken, resetPassword };
};
