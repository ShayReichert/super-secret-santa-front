"use client";

import { useState, KeyboardEvent } from "react";
import styles from "./AdminUserItem.module.scss";
import Image from "next/image";
import PasswordDialog from "../PasswordDialog/PasswordDialog";

export default function AdminUserItem({
  user,
  index,
  onEdit,
  onDelete,
  onEditSubmit,
  updateUser,
}: {
  user: User;
  index: number;
  onEdit: (index: number, text: string, field: "name" | "email") => void;
  onDelete: (index: number) => void;
  onEditSubmit: (index: number, newName: string, newEmail: string) => void;
  updateUser: (username: string, data: Partial<User>) => Promise<boolean>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState(user.username);
  const [localEmail, setLocalEmail] = useState(user.email);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const handleChangePassword = () => {
    setIsPasswordDialogOpen(true);
  };

  const handlePasswordConfirm = async (newPassword: string) => {
    const success = await updateUser(user.username, { password: newPassword } as Partial<User>);
    if (success) {
      console.log("Mot de passe mis à jour avec succès pour", user.username);
    } else {
      console.error("Erreur lors de la mise à jour du mot de passe de", user.username);
    }

    setIsPasswordDialogOpen(false);
  };

  // Enable editing for both fields
  const handleEdit = () => {
    setIsEditing(true);
    setLocalName(user.username);
    setLocalEmail(user.email);
  };

  // Submit modifications
  const submitEdit = () => {
    if (isEditing) {
      onEditSubmit(index, localName, localEmail);
      setIsEditing(false);
    }
  };

  // Manage local changes
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalName(e.target.value);
    onEdit(index, e.target.value, "name");
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalEmail(e.target.value);
    onEdit(index, e.target.value, "email");
  };

  // Handle keyboard events
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submitEdit();
    }
  };

  // Handle blur with a delay
  const handleBlur = () => {
    setTimeout(() => {
      if (!document.activeElement || document.activeElement.tagName !== "INPUT") {
        submitEdit();
        setIsEditing(false);
      }
    }, 100);
  };

  return (
    <tr className={styles["user-item"]}>
      {isEditing ? (
        <>
          <td>
            <input
              type="text"
              name="editUsername"
              value={localName}
              onChange={handleChangeName}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              autoFocus
            />
          </td>
          <td>
            <input type="email" name="editEmail" value={localEmail} onChange={handleChangeEmail} onKeyDown={handleKeyDown} onBlur={handleBlur} />
          </td>
        </>
      ) : (
        <>
          <td>
            <span>{user.username}</span>
          </td>
          <td>
            <span>{user.email}</span>
          </td>
        </>
      )}

      {isEditing ? (
        <td>
          <span className={styles["icons"]}>
            <button>OK</button>
          </span>
        </td>
      ) : (
        <td>
          <span className={styles["icons"]}>
            <button className={styles["edit-button"]} onClick={handleEdit} aria-label="Modifier">
              <Image className={styles["edit-icon"]} src="/icons/edit.svg" alt="Modifier" height={20} width={20} priority />
            </button>
            <button className={styles["password-button"]} onClick={handleChangePassword} aria-label="Réinitialiser le mot de passe">
              <Image className={styles["password-icon"]} src="/icons/password.svg" alt="Modifier" height={20} width={20} priority />
            </button>
            <PasswordDialog open={isPasswordDialogOpen} onClose={() => setIsPasswordDialogOpen(false)} onConfirm={handlePasswordConfirm} />
            <button className={styles["delete-button"]} onClick={() => onDelete(index)} aria-label="Supprimer">
              <Image className={styles["delete-icon"]} src="/icons/delete.svg" alt="Supprimer" height={26} width={26} priority />
            </button>
          </span>
        </td>
      )}
    </tr>
  );
}
