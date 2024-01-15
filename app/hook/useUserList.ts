import axiosInstance from "../services/axiosInstance";

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

  const addUser = async (newUser: { username: string; email: string; password: string }): Promise<User> => {
    try {
      const response = await axiosInstance.post<User>("/api/signin", newUser);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création d'un utilisateur", error);
      return Promise.reject(error);
    }
  };

  const updateUser = async (username: string, updatedUser: { username: string; email?: string }): Promise<boolean> => {
    try {
      await axiosInstance.put(`/api/admin/user/${username}`, updatedUser);
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
