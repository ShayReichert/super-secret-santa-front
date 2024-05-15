import { AxiosError } from "axios";
import axiosInstance from "../../services/axiosInstance";

export const useEvents = () => {
  const getEvents = async (): Promise<SantaEvent[]> => {
    try {
      const response = await axiosInstance.get<SantaEvent[]>("/api/events");

      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des évènements", error);
      throw new Error("Erreur lors de la récupération des évènements");
    }
  };

  const getCurrentEvent = async (id: number): Promise<SantaEvent> => {
    try {
      const response = await axiosInstance.get<SantaEvent>(`/api/events/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de l'évènement courant", error);
      throw new Error("Erreur lors de la récupération des détails de l'évènement courant");
    }
  };

  const setOrganizerOfEvent = async (eventId: number, userId: number): Promise<void> => {
    try {
      await axiosInstance.get(`/api/events/organizer/${userId}/${eventId}`);
    } catch (error) {
      console.error("Erreur lors de la modification de l'organisateur de l'évènement", error);
      throw new Error("Erreur lors de la modification de l'organisateur de l'évènement");
    }
  };

  const setUserToEvent = async (eventId: number, userId: number): Promise<void> => {
    try {
      await axiosInstance.get(`/api/events/add/${userId}/${eventId}`);
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un utilisateur à l'évènement", error);
      throw new Error("Erreur lors de l'ajout d'un utilisateur à l'évènement");
    }
  };

  const createEvent = async (eventName: string): Promise<SantaEvent | undefined> => {
    try {
      const response = await axiosInstance.post<SantaEvent>("/api/events", { name: eventName });
      if (response.data && response.data.id) {
        return response.data;
      }
      return undefined;
    } catch (error) {
      console.error("Erreur lors de la création de l'évènement", error);
      return undefined;
    }
  };

  const deleteEvent = async (eventId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/events/${eventId}`);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'évènement", error);
      throw new Error("Erreur lors de la suppression de l'évènement");
    }
  };

  const removeUserToEvent = async (eventId: number, userId: number): Promise<void> => {
    try {
      await axiosInstance.get(`/api/events/remove/${userId}/${eventId}`);
    } catch (error) {
      console.error("Erreur lors de la suppression d'un·e utilisateur·ice à l'évènement", error);
      throw new Error("Erreur lors de la suppression d'un·e utilisateur·ice à l'évènement");
    }
  };

  const renameEvent = async (eventId: number, newName: string): Promise<void> => {
    try {
      await axiosInstance.put(`/api/events/${eventId}`, { name: newName });
    } catch (error) {
      console.error("Erreur lors de la modification du nom de l'évènement", error);
      throw new Error("Erreur lors de la modification du nom de l'évènement");
    }
  };

  const getUsersToInvite = async (): Promise<User[]> => {
    try {
      const response = await axiosInstance.get<User[]>("/api/events/usersToInvit");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de la liste des utilisateurs à inviter", error);
      throw new Error("Erreur lors de la récupération de la liste des utilisateurs à inviter");
    }
  };

  const sendInvitation = async (fromUserId: number, toUserId: number, eventId: number): Promise<void> => {
    try {
      await axiosInstance.get(`api/events/invit/${fromUserId}/${toUserId}/${eventId}`);
    } catch (error) {
      console.error("Erreur lors de l'invitation d'un·e utilisateur·ice à l'évènement", error);
      throw new Error("Erreur lors de l'invitation d'un·e utilisateur·ice à l'évènement");
    }
  };

  const checkTokenAndAddToEvent = async (token: string): Promise<void> => {
    try {
      await axiosInstance.get(`/process/invit/${token}`);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        console.error("Erreur lors de l'ajout à l'évènement", error?.response?.data && ":", error?.response?.data);
      }
      throw new Error("Erreur lors de l'ajout à l'évènement");
    }
  };

  return {
    getEvents,
    getCurrentEvent,
    setOrganizerOfEvent,
    setUserToEvent,
    createEvent,
    deleteEvent,
    removeUserToEvent,
    renameEvent,
    getUsersToInvite,
    sendInvitation,
    checkTokenAndAddToEvent,
  };
};
