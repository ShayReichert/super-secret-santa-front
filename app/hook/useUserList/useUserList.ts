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

  const createUser = async (newUser: { username: string; email: string; password: string }): Promise<User | string> => {
    try {
      const response = await axiosInstance.post<User>("/api/signin", newUser);
      const createdUser = response.data;

      // Send email confirmation
      try {
        await axiosInstance.get(`/api/send-email-confirmation-inscription/${createdUser.email}`);
      } catch (emailError) {
        console.error("Erreur lors de l'envoi de l'email de confirmation", emailError);
        throw new Error("Erreur lors de l'envoi de l'email de confirmation");
      }

      return createdUser;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.message.includes("Integrity constraint violation: 1062 Duplicate entry")) {
          console.error("Le nom ou l'email existe déjà !", error);
          throw new Error("Le nom ou l'email existe déjà !");
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

  const deleteUser = async (id: number): Promise<boolean> => {
    try {
      // Retrieve all events
      const eventsResponse = await axiosInstance.get<SantaEvent[]>("/api/events");
      const events = eventsResponse.data;

      //  Filter events where the user participates
      const userEvents = events.filter((event) => event.users.some((user) => user.id === id));

      // Remove user from each event
      await Promise.all(userEvents.map((event) => axiosInstance.get(`/api/events/remove/${id}/${event.id}`)));

      //  Delete the user
      await axiosInstance.delete(`/api/admin/user/${id}`);

      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression d'un utilisateur", error);
      return false;
    }
  };

  return { getUsers, createUser, updateUser, deleteUser };
};
