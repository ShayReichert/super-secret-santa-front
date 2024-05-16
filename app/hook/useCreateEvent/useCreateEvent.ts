import { useState } from "react";
import { useEvents } from "@/app/hook/useEvents/useEvents";
import { useUser } from "@/app/context/UserContext";
import { setCookie } from "cookies-next";
import { cookieParams } from "@/app/services/cookieParams";

export const useCreateEvent = () => {
  const { createEvent, setUserToEvent } = useEvents();
  const { userState } = useUser();
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  const handleCreateEvent = () => {
    setIsEventDialogOpen(true);
  };

  const handleCreateEventConfirm = async (newEventName: string) => {
    try {
      const newEvent = await createEvent(newEventName);

      if (newEvent && newEvent.id) {
        const userId = userState.data?.id;

        if (userId) {
          await setUserToEvent(newEvent.id, userId);
        } else {
          console.error("Erreur: ID utilisateur non trouvé.");
        }

        setIsEventDialogOpen(false);
        setCookie("selectedEventId", newEvent.id.toString(), cookieParams);
        window.location.href = "/admin";
      } else {
        console.error("Erreur lors de la création de l'événement", newEventName);
      }
    } catch (error) {
      console.error("Erreur lors de la création ou de l'ajout de l'organisateur à l'événement", error);
    }
  };

  return {
    isEventDialogOpen,
    handleCreateEvent,
    handleCreateEventConfirm,
    setIsEventDialogOpen,
  };
};
