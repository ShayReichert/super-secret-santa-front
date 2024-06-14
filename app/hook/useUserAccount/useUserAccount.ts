import { useAuth } from "@/app/hook/useAuth/useAuth";
import axiosInstance from "../../services/axiosInstance";

export const useUserAccount = () => {
  const { logout } = useAuth();

  const deleteAccount = async () => {
    try {
      const response = await axiosInstance.get("api/user/delete-compte");
      if (response.data === "Vous êtes organisateur d'un évènement, merci de changer l'organisateur") {
        return response.data;
      } else {
        logout();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du compte", error);
    }
  };

  const updatePseudo = async (userId: number, newPseudo: string) => {
    try {
      const response = await axiosInstance.put(`/api/user/${userId}`, { pseudo: newPseudo });
      if (response.data.status === 500) {
        console.error("Erreur lors de la mise à jour du pseudo", response.data);
        return response.data.message;
      } else if (response.data.id) {
        return response.data;
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du pseudo", error);
    }
  };

  return { deleteAccount, updatePseudo };
};
