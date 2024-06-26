"use client";

import { useState, KeyboardEvent } from "react";
import styles from "./AdminUserItem.module.scss";
import Image from "next/image";
import PasswordDialog from "../PasswordDialog/PasswordDialog";
import OrganizerDialog from "../OrganizerDialog/OrganizerDialog";
import Tooltip from "@mui/material/Tooltip";

interface Props {
  user: User;
  organizer: User | null;
  index: number;
  onEdit: (index: number, text: string, field: "name" | "email") => void;
  onDelete: (index: number) => void;
  onRemove: (index: number) => void;
  onEditSubmit: (index: number, newName: string, newEmail: string) => void;
  updateUser: (id: number, data: Partial<User>) => Promise<boolean>;
  isAdministrator: boolean;
  onSetOrganizer: (userId: number) => void;
}

export default function AdminUserItem({
  user,
  organizer,
  index,
  onEdit,
  onDelete,
  onRemove,
  onEditSubmit,
  updateUser,
  isAdministrator,
  onSetOrganizer,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState(user.username);
  const [localEmail, setLocalEmail] = useState(user.email);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isOrganizerDialogOpen, setIsOrganizerDialogOpen] = useState(false);
  const isOrganizer = organizer?.username === user.username;

  const handleOpenOrganizerDialog = () => {
    if (!isOrganizer) {
      setIsOrganizerDialogOpen(true);
    }
  };

  const handleChangePassword = () => {
    setIsPasswordDialogOpen(true);
  };

  const handleOrganizerConfirm = async () => {
    onSetOrganizer(user.id);
    setIsOrganizerDialogOpen(false);
  };

  const handlePasswordConfirm = async (newPassword: string) => {
    const success = await updateUser(user.id, { password: newPassword } as Partial<User>);
    if (success) {
      // console.log("Mot de passe mis à jour avec succès pour", user.username);
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
    <tr className={`${styles["user-item"]} ${isOrganizer ? styles["organizer"] : ""}`}>
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
          <td>{user.pseudo ? <span>{user.pseudo}</span> : <span>{user.username}</span>}</td>
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
            <span className={styles["icons-wrapper"]}>
              {/* Bouton Attribuer le rôle organisateur */}
              <Tooltip title={isOrganizer ? "Cette personne est déjà organisateur·ice" : "Attribuer le rôle organisateur"}>
                <button
                  className={`${styles["organizer-button"]} ${isOrganizer ? styles["isOrganizer"] : ""} `}
                  onClick={handleOpenOrganizerDialog}
                  aria-label="Attribuer le rôle d'organisateur"
                >
                  {isOrganizer ? (
                    <Image className={styles["organizer-icon"]} src="/icons/star.svg" alt="Organisateur" height={20} width={20} priority />
                  ) : (
                    <Image
                      className={styles["set-organizer-icon"]}
                      src="/icons/star-full.svg"
                      alt="Attribuer le rôle d'organisateur"
                      height={20}
                      width={20}
                      priority
                    />
                  )}
                </button>
              </Tooltip>
              <OrganizerDialog
                open={isOrganizerDialogOpen}
                onClose={() => setIsOrganizerDialogOpen(false)}
                onConfirm={handleOrganizerConfirm}
                userName={user.username}
                isAdministrator={isAdministrator}
              />

              {/* Bouton Modifier */}
              {isAdministrator && (
                <Tooltip title="Modifier">
                  <button className={styles["edit-button"]} onClick={handleEdit} aria-label="Modifier">
                    <Image className={styles["edit-icon"]} src="/icons/edit.svg" alt="Modifier" height={20} width={20} priority />
                  </button>
                </Tooltip>
              )}
              {/* Bouton Réinitialiser le mot de passe */}
              {isAdministrator && (
                <Tooltip title="Réinitialiser le mot de passe">
                  <button className={styles["password-button"]} onClick={handleChangePassword} aria-label="Réinitialiser le mot de passe">
                    <Image
                      className={styles["password-icon"]}
                      src="/icons/password.svg"
                      alt="Réinitialiser le mot de passe"
                      height={20}
                      width={20}
                      priority
                    />
                  </button>
                </Tooltip>
              )}
              <PasswordDialog open={isPasswordDialogOpen} onClose={() => setIsPasswordDialogOpen(false)} onConfirm={handlePasswordConfirm} />
              {/* Bouton Retirer de l'évènement */}
              <Tooltip title="Retirer de l'évènement">
                <button className={styles["remove-button"]} onClick={() => onRemove(index)} aria-label="Retirer de l'évènement">
                  <Image className={styles["remove-icon"]} src="/icons/remove.svg" alt="Retirer de l'évènement" height={18} width={18} priority />
                </button>
              </Tooltip>
              {/* Bouton Supprimer */}
              {isAdministrator && (
                <Tooltip title="Supprimer">
                  <button className={styles["delete-button"]} onClick={() => onDelete(index)} aria-label="Supprimer">
                    <Image className={styles["delete-icon"]} src="/icons/delete.svg" alt="Supprimer" height={20} width={20} priority />
                  </button>
                </Tooltip>
              )}
            </span>
          </span>
        </td>
      )}
    </tr>
  );
}
