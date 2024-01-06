"use client";

import { useState, useCallback, FormEvent } from "react";
import styles from "./UserWishlist.module.scss";
import UserGiftItem from "../UserGiftItem/UserGiftItem";
import Image from "next/image";

export default function UserWishlist() {
  const [gifts, setGifts] = useState<Gift[]>([
    { name: "Un micro-onde", isEditing: false, editingText: "" },
    { name: "Une pomme", isEditing: false, editingText: "" },
    { name: "Un stylo bic", isEditing: false, editingText: "" },
  ]);

  const [newGift, setNewGift] = useState("");

  const handleAddGift = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (newGift.trim()) {
      setGifts([...gifts, { name: newGift, isEditing: false, editingText: "" }]);
      setNewGift("");
    }
  };

  const handleEditClick = useCallback(
    (index: number, text: string): void => {
      setGifts(gifts.map((gift, idx) => (idx === index ? { ...gift, isEditing: true, editingText: text } : gift)));
    },
    [gifts]
  );

  const handleEditSubmit = useCallback(
    (index: number): void => {
      setGifts(gifts.map((gift, idx) => (idx === index ? { ...gift, name: gift.editingText, isEditing: false } : gift)));
    },
    [gifts]
  );

  const handleDelete = useCallback(
    (index: number): void => {
      setGifts(gifts.filter((_, idx) => idx !== index));
    },
    [gifts]
  );

  return (
    <div className={styles["dashboard-wrapper"]}>
      <div className={styles["dashboard-background"]}>
        <div className={styles["content"]}>
          <p>Et toi, que voudrais-tu pour Noël ?</p>
          <ul className={styles["wishlist"]}>
            {gifts.map((gift, index) => (
              <UserGiftItem key={index} gift={gift} index={index} onEdit={handleEditClick} onDelete={handleDelete} onEditSubmit={handleEditSubmit} />
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
    </div>
  );
}
