"use client";

import { useState, FormEvent } from "react";
import styles from "./UserWishlist.module.scss";
import UserGiftItem from "../UserGiftItem/UserGiftItem";
import Image from "next/image";
import ConfirmationDialog from "@/app/components/ConfirmationDialog/ConfirmationDialog";
import { useGiftList } from "@/app/hook/useGiftList/useGiftList";
import { useUser } from "@/app/context/UserContext";
import Loader from "@/app/components/Loader/Loader";

export default function UserWishlist() {
  const { userState, currentEvent } = useUser();
  const { addGift, updateGift, deleteGift } = useGiftList();
  const [newGift, setNewGift] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [editingGiftId, setEditingGiftId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const giftListId = currentEvent?.giftList?.id;

  const handleAddGift = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newGift.trim()) {
      if (giftListId !== undefined) {
        await addGift(newGift, giftListId);
        setNewGift("");
      } else {
        console.error("Erreur lors de l'ajout du cadeau : aucun événement sélectionné ou l'événement n'existe pas");
      }
    }
  };

  const handleEditClick = (giftId: number, text: string): void => {
    setEditingGiftId(giftId);
    setEditingText(text);
  };

  const handleEditSubmit = async (giftId: number): Promise<void> => {
    if (editingText.trim()) {
      if (giftListId !== undefined) {
        await updateGift(giftId, editingText, giftListId);
        setEditingGiftId(null);
        setEditingText("");
      } else {
        console.error("Erreur lors de la modification du cadeau : aucun événement sélectionné ou l'événement n'existe pas");
      }
    }
  };

  const confirmDelete = async () => {
    if (itemToDelete !== null) {
      const eventWithGiftToDelete = userState.data?.events.find((event) => event.giftList.gifts.some((gift) => gift.id === itemToDelete));

      if (eventWithGiftToDelete) {
        await deleteGift(itemToDelete, eventWithGiftToDelete.giftList.id);
      }
      closeModal();
    }
  };

  const openModal = (giftId: number): void => {
    setIsModalOpen(true);
    setItemToDelete(giftId);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setItemToDelete(null);
  };

  if (userState.loading) {
    return (
      <div className={styles["dashboard-wrapper"]}>
        <div className={styles["dashboard-background"]}>
          <Loader />
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className={styles["dashboard-wrapper"]}>
        <div className={styles["dashboard-background"]}></div>
      </div>
    );
  }

  return (
    <div className={styles["dashboard-wrapper"]}>
      <div className={styles["dashboard-background"]}>
        <div className={styles["content"]}>
          <p>Et toi, que voudrais-tu pour Noël ?</p>
          <ul className={styles["wishlist"]}>
            {currentEvent.giftList?.gifts && currentEvent.giftList?.gifts.length > 0 ? (
              currentEvent.giftList?.gifts.map((gift) => (
                <UserGiftItem
                  key={gift.id}
                  gift={{ ...gift, isEditing: gift.id === editingGiftId, editingText }}
                  onEdit={handleEditClick}
                  onDelete={openModal}
                  onEditSubmit={handleEditSubmit}
                />
              ))
            ) : (
              <p className={styles["no-gift"]}>Ajoute des cadeaux à ta liste !</p>
            )}
          </ul>
          <form onSubmit={handleAddGift}>
            <input
              type="text"
              className=""
              placeholder="Ajoute un cadeau"
              name="newGift"
              value={newGift}
              onChange={(e) => setNewGift(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className={styles["button"]}>
              AJOUTER
            </button>
          </form>
        </div>
        <Image className={styles["reindeer-image"]} src="/renne.webp" alt="Un petit renne de noël" width={93} height={162} priority />
      </div>
      <ConfirmationDialog text="Es-tu sûr·e de vouloir supprimer ce cadeau ?" open={isModalOpen} onClose={closeModal} onConfirm={confirmDelete} />
    </div>
  );
}
