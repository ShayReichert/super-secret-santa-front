"use client";

import { useState, KeyboardEvent } from "react";
import styles from "./AdminUserItem.module.scss";
import Image from "next/image";

export default function AdminUserItem({
  user,
  index,
  onEdit,
  onDelete,
  onEditSubmit,
}: {
  user: User;
  index: number;
  onEdit: (index: number, text: string, field: "name" | "email") => void;
  onDelete: (index: number) => void;
  onEditSubmit: (index: number, newName: string, newEmail: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState(user.name);
  const [localEmail, setLocalEmail] = useState(user.email);

  // Activer l'édition pour les deux champs
  const handleEdit = () => {
    setIsEditing(true);
    setLocalName(user.name);
    setLocalEmail(user.email);
  };

  // Soumettre les modifications
  const submitEdit = () => {
    if (isEditing) {
      onEditSubmit(index, localName, localEmail);
      setIsEditing(false);
    }
  };

  // Gérer les changements locaux
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalName(e.target.value);
    onEdit(index, e.target.value, "name");
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalEmail(e.target.value);
    onEdit(index, e.target.value, "email");
  };

  // Gérer les événements clavier
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submitEdit();
    }
  };

  // Gérer le flou avec un délai
  const handleBlur = () => {
    setTimeout(() => {
      if (!document.activeElement || document.activeElement.tagName !== "INPUT") {
        setIsEditing(false);
      }
    }, 100);
  };

  return (
    <tr className={styles["user-item"]}>
      <td>
        {isEditing ? (
          <div onBlur={handleBlur}>
            <input value={localName} onChange={handleChangeName} onKeyDown={handleKeyDown} autoFocus />
            <input value={localEmail} onChange={handleChangeEmail} onKeyDown={handleKeyDown} />
          </div>
        ) : (
          <>
            <span>{user.name}</span>
            <span>{user.email}</span>
          </>
        )}
      </td>
      <td>
        <span className={styles["icons"]}>
          {!isEditing && (
            <button className={styles["edit-button"]} onClick={handleEdit} aria-label="Modifier">
              <Image className={styles["edit-icon"]} src="/icons/edit.svg" alt="Modifier" height={20} width={20} priority />
            </button>
          )}
          <button className={styles["delete-button"]} onClick={() => onDelete(index)} aria-label="Supprimer">
            <Image className={styles["delete-icon"]} src="/icons/delete.svg" alt="Supprimer" height={26} width={26} priority />
          </button>
        </span>
      </td>
    </tr>
  );
}
