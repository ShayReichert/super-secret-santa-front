"use client";

import { useState, FormEvent } from "react";
import styles from "./UserWishlist.module.scss";
import UserGiftItem from "../UserGiftItem/UserGiftItem";
import Image from "next/image";
import ConfirmationDialog from "@/app/components/ConfirmationDialog/ConfirmationDialog";

export default function UserWishlist() {
  const [gifts, setGifts] = useState<Gift[]>([
    { name: "Un micro-onde", isEditing: false, editingText: "" },
    { name: "Une pomme", isEditing: false, editingText: "" },
    { name: "Un stylo bic", isEditing: false, editingText: "" },
  ]);
  const [newGift, setNewGift] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const openModal = (index: number): void => {
    setIsModalOpen(true);
    setItemToDelete(index);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  const confirmDelete = (): void => {
    if (itemToDelete !== null) handleDelete(itemToDelete);
    closeModal();
  };

  const handleAddGift = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (newGift.trim()) {
      setGifts([...gifts, { name: newGift, isEditing: false, editingText: "" }]);
      setNewGift("");
    }
  };

  const handleEditClick = (index: number, text: string): void => {
    setGifts(gifts.map((gift, idx) => (idx === index ? { ...gift, isEditing: true, editingText: text } : gift)));
  };

  const handleEditSubmit = (index: number): void => {
    const currentGift = gifts[index];

    if (!currentGift.editingText.trim()) {
      setGifts(gifts.filter((_, idx) => idx !== index));
    } else {
      setGifts(
        gifts.map((gift, idx) => (idx === index ? { ...gift, name: currentGift.editingText.trim(), isEditing: false, editingText: "" } : gift))
      );
    }
  };

  const handleDelete = (index: number): void => {
    setGifts(gifts.filter((_, idx) => idx !== index));
  };

  return (
    <div className={styles["dashboard-wrapper"]}>
      <div className={styles["dashboard-background"]}>
        <div className={styles["content"]}>
          <p>Et toi, que voudrais-tu pour Noël ?</p>
          <ul className={styles["wishlist"]}>
            {gifts.map((gift, index) => (
              <UserGiftItem key={index} gift={gift} index={index} onEdit={handleEditClick} onDelete={openModal} onEditSubmit={handleEditSubmit} />
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
