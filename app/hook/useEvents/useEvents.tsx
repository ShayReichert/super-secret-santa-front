import axiosInstance from "../../services/axiosInstance";
// import axios from "axios";

export const useEvents = () => {
  const getEvents = async (): Promise<Events[]> => {
    try {
      const response = await axiosInstance.get<Events[]>("/api/events");

      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des évènements", error);
      return [];
    }
  };

  return { getEvents };
};
