"use client";

import { useCallback, KeyboardEvent } from "react";
import styles from "./UserGiftItem.module.scss";
import Image from "next/image";

export default function UserGiftItem({
  gift,
  index,
  onEdit,
  onDelete,
  onEditSubmit,
}: {
  gift: Gift;
  index: number;
  onEdit: (index: number, text: string) => void;
  onDelete: (index: number) => void;
  onEditSubmit: (index: number) => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onEditSubmit(index);
      }
    },
    [index, onEditSubmit]
  );

  return (
    <li className={styles["gift-item"]}>
      {gift.isEditing ? (
        <input
          value={gift.editingText}
          onChange={(e) => onEdit(index, e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => onEditSubmit(index)}
          autoFocus
        />
      ) : (
        <>
          {gift.name}
          <span className={styles["icons"]}>
            <Image className={styles["edit-icon"]} src="/icons/edit.svg" alt="edit" onClick={() => onEdit(index, gift.name)} height={20} width={20} />
            <Image className={styles["delete-icon"]} src="/icons/delete.svg" alt="delete" onClick={() => onDelete(index)} height={26} width={26} />
          </span>
        </>
      )}
    </li>
  );
}
