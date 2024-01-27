import axiosInstance from "../../services/axiosInstance";
import { useUser } from "@/app/context/UserContext";

export const useGiftList = () => {
  const { userState, setUserState } = useUser();

  const addGift = async (giftName: string) => {
    try {
      const response = await axiosInstance.post("api/gifts", { name: giftName });
      const newGift = response.data;

      setUserState((prevState) => {
        if (!prevState.data) {
          return prevState;
        }

        return {
          ...prevState,
          data: {
            ...prevState.data,
            gifts: [...prevState.data.gifts, newGift],
          },
        };
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un cadeau", error);
      // Gérer les erreurs comme nécessaire
    }
  };

  const updateGift = async (giftId: number, updatedName: string) => {
    try {
      await axiosInstance.put(`api/gifts/${giftId}`, { name: updatedName });

      setUserState((prevState) => {
        if (!prevState.data) {
          return prevState;
        }

        return {
          ...prevState,
          data: {
            ...prevState.data,
            gifts: prevState.data.gifts.map((gift) => (gift.id === giftId ? { ...gift, name: updatedName } : gift)),
          },
        };
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'un cadeau", error);
      // Gérer les erreurs comme nécessaire
    }
  };

  const deleteGift = async (giftId: number) => {
    try {
      await axiosInstance.delete(`api/gifts/${giftId}`);

      setUserState((prevState) => {
        if (!prevState.data) {
          return prevState;
        }

        return {
          ...prevState,
          data: {
            ...prevState.data,
            gifts: prevState.data.gifts.filter((gift) => gift.id !== giftId),
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
