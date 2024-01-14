"use client";

import { useState, FormEvent } from "react";
import styles from "./UserWishlist.module.scss";
import UserGiftItem from "../UserGiftItem/UserGiftItem";
import Image from "next/image";
import ConfirmationDialog from "@/app/components/ConfirmationDialog/ConfirmationDialog";
import { useGiftList } from "@/app/hook/useGiftList";
import { useUser } from "@/app/context/UserContext";

export default function UserWishlist() {
  const { userState } = useUser();
  const { addGift, updateGift, deleteGift } = useGiftList();
  const [newGift, setNewGift] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [editingGiftId, setEditingGiftId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleAddGift = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newGift.trim()) {
      await addGift(newGift);
      setNewGift("");
    }
  };

  const handleEditClick = (giftId: number, text: string): void => {
    setEditingGiftId(giftId);
    setEditingText(text);
  };

  const handleEditSubmit = async (giftId: number): Promise<void> => {
    if (editingText.trim()) {
      await updateGift(giftId, editingText);
      setEditingGiftId(null);
      setEditingText("");
    }
  };

  const confirmDelete = async () => {
    if (itemToDelete !== null) {
      const giftToDelete = userState.data?.gifts.find((gift) => gift.id === itemToDelete);

      if (giftToDelete) {
        await deleteGift(giftToDelete.id);
      }
    }
    closeModal();
  };

  const openModal = (giftId: number): void => {
    setIsModalOpen(true);
    setItemToDelete(giftId);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className={styles["dashboard-wrapper"]}>
      <div className={styles["dashboard-background"]}>
        <div className={styles["content"]}>
          <p>Et toi, que voudrais-tu pour Noël ?</p>
          <ul className={styles["wishlist"]}>
            {userState.data?.gifts.map((gift) => (
              <UserGiftItem
                key={gift.id}
                gift={{ ...gift, isEditing: gift.id === editingGiftId, editingText }}
                onEdit={handleEditClick}
                onDelete={openModal}
                onEditSubmit={handleEditSubmit}
              />
            ))}
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
