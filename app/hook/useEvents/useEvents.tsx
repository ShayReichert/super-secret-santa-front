import axiosInstance from "../../services/axiosInstance";
// import axios from "axios";

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
      await axiosInstance.post(`/api/events/organizer/${userId}/${eventId}`);
    } catch (error) {
      console.error("Erreur lors de la modification de l'organisateur de l'évènement", error);
      throw new Error("Erreur lors de la modification de l'organisateur de l'évènement");
    }
  };

  return { getEvents, getCurrentEvent, setOrganizerOfEvent };
};