"use client";

import { KeyboardEvent } from "react";
import styles from "./UserGiftItem.module.scss";
import Image from "next/image";

export default function UserGiftItem({
  gift,
  onEdit,
  onDelete,
  onEditSubmit,
}: {
  gift: UserGift;
  onEdit: (giftId: number, text: string) => void;
  onDelete: (giftId: number) => void;
  onEditSubmit: (giftId: number) => void;
}) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onEditSubmit(gift.id);
    }
  };

  return (
    <li className={styles["gift-item"]}>
      {gift.isEditing ? (
        <input
          aria-label={`Modifier ${gift.name}`}
          value={gift.editingText}
          onChange={(e) => onEdit(gift.id, e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => onEditSubmit(gift.id)}
          autoFocus
        />
      ) : (
        <>
          {gift.name}
          <span className={styles["icons"]}>
            <span className={styles["icons-wrapper"]}>
              <button className={styles["edit-button"]} onClick={() => onEdit(gift.id, gift.name)} aria-label="Modifier">
                <Image className={styles["edit-icon"]} src="/icons/edit.svg" alt="Modifier" height={20} width={20} />
              </button>
              <button className={styles["delete-button"]} onClick={() => onDelete(gift.id)} aria-label="Supprimer">
                <Image className={styles["delete-icon"]} src="/icons/delete.svg" alt="Supprimer" height={20} width={20} />
              </button>
            </span>
          </span>
        </>
      )}
    </li>
  );
}
