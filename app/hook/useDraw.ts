import { useState } from "react";
import axiosInstance from "../services/axiosInstance";

const useDraw = () => {
  const [drawState, setDrawState] = useState({
    isLoading: false,
    error: "",
    successMessage: "",
  });

  const performDraw = async (eventId: number) => {
    setDrawState({ ...drawState, isLoading: true });
    try {
      const response = await axiosInstance.get(`/api/admin/users/setsanta/${eventId}`);
      const message = response.data;

      if (message === "Pères Noel attribués") {
        setDrawState({ isLoading: false, error: "", successMessage: message });
      } else {
        setDrawState({ isLoading: false, error: "Réponse inattendue de l'API", successMessage: "" });
      }
    } catch (error: any) {
      setDrawState({ isLoading: false, error: error.message as string, successMessage: "" });
    }
  };

  return { drawState, performDraw };
};

export default useDraw;
