import axiosInstance from "../../services/axiosInstance";
import axios from "axios";

export const useUserList = () => {
  const getUsers = async (): Promise<User[]> => {
    try {
      const response = await axiosInstance.get<User[]>("/api/admin/users");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
      return [];
    }
  };

  const addUser = async (newUser: { username: string; email: string; password: string }): Promise<User | string> => {
    try {
      const response = await axiosInstance.post<User>("/api/signin", newUser);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.message.includes("Integrity constraint violation: 1062 Duplicate entry")) {
          console.error("Le nom ou l'email existe déjà !", error);
          return "Le nom ou l'email existe déjà !";
        }
      }
      console.error("Erreur lors de la création d'un utilisateur", error);
      return Promise.reject(error);
    }
  };

  const updateUser = async (id: number, updatedUser: { username?: string; email?: string; password?: string }): Promise<boolean> => {
    try {
      await axiosInstance.put(`/api/admin/user/${id}`, updatedUser);
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'un utilisateur", error);
      return false;
    }
  };

  const deleteUser = async (username: string): Promise<boolean> => {
    try {
      await axiosInstance.delete(`/api/admin/user/${username}`);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression d'un utilisateur", error);
      return false;
    }
  };

  return { getUsers, addUser, updateUser, deleteUser };
};
