import axiosInstance from "../../services/axiosInstance";
import { useUser } from "@/app/context/UserContext";

export const useGiftList = () => {
  const { setUserState } = useUser();

  const addGift = async (giftName: string, giftListId: number) => {
    try {
      const response = await axiosInstance.post(`api/gifts/${giftListId}`, { name: giftName });
      const newGift = response.data;

      setUserState((prevState) => {
        if (!prevState.data) {
          return prevState;
        }

        const updatedEvents = prevState.data.events.map((event) => {
          if (event.giftList.id === giftListId) {
            return {
              ...event,
              giftList: {
                ...event.giftList,
                gifts: [...event.giftList.gifts, newGift],
              },
            };
          }
          return event;
        });

        return {
          ...prevState,
          data: {
            ...prevState.data,
            events: updatedEvents,
          },
        };
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un cadeau", error);
      // Gérer les erreurs comme nécessaire
    }
  };

  const updateGift = async (giftId: number, updatedName: string, giftListId: number) => {
    try {
      await axiosInstance.put(`api/gifts/${giftId}`, { name: updatedName });

      setUserState((prevState) => {
        if (!prevState.data) {
          return prevState;
        }

        const updatedEvents = prevState.data.events.map((event) => {
          if (event.giftList.id === giftListId) {
            const updatedGifts = event.giftList.gifts.map((gift) => (gift.id === giftId ? { ...gift, name: updatedName } : gift));

            return {
              ...event,
              giftList: {
                ...event.giftList,
                gifts: updatedGifts,
              },
            };
          }
          return event;
        });

        return {
          ...prevState,
          data: {
            ...prevState.data,
            events: updatedEvents,
          },
        };
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'un cadeau", error);
      // Gérer les erreurs comme nécessaire
    }
  };

  const deleteGift = async (giftId: number, giftListId: number) => {
    try {
      await axiosInstance.delete(`api/gifts/${giftId}`);

      setUserState((prevState) => {
        if (!prevState.data) {
          return prevState;
        }

        const updatedEvents = prevState.data.events.map((event) => {
          if (event.giftList.id === giftListId) {
            return {
              ...event,
              giftList: {
                ...event.giftList,
                gifts: event.giftList.gifts.filter((gift) => gift.id !== giftId),
              },
            };
          }
          return event;
        });

        return {
          ...prevState,
          data: {
            ...prevState.data,
            events: updatedEvents,
          },
        };
      });
    } catch (error) {
      console.error("Erreur lors de la suppression d'un cadeau", error);
      // Gérer les erreurs comme nécessaire
    }
  };

  return { addGift, updateGift, deleteGift };
};
