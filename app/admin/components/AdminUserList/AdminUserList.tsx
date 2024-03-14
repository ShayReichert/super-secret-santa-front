"use client";

import styles from "./AdminUserList.module.scss";
import { Titan_One } from "next/font/google";
import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import { useUserList } from "@/app/hook/useUserList/useUserList";
import { useEvents } from "@/app/hook/useEvents/useEvents";
import useDraw from "@/app/hook/useDraw";
import AdminUserItem from "../AdminUserItem/AdminUserItem";
import MenuListAdmin from "../MenuListAdmin/MenuListAdmin";
import ConfirmationDialog from "@/app/components/ConfirmationDialog/ConfirmationDialog";
import CreateUserDialog from "../CreateUserDialog/CreateUserDialog";
import AddUsersDialog from "../AddUsersDialog/AddUsersDialog";
import { isValidEmail } from "@/app/services/inputValidator";
import { deleteCookie } from "cookies-next";
import RenameEventDialog from "../RenameEventDialog/RenameEventDialog";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

export default function AdminUserList() {
  const { userState, currentEvent, currentEventId, isAdministrator } = useUser();
  const { createUser, updateUser, deleteUser } = useUserList();
  const { getCurrentEvent, setOrganizerOfEvent, setUserToEvent, deleteEvent, removeUserToEvent, renameEvent } = useEvents();
  const { drawState, performDraw } = useDraw();
  const [users, setUsers] = useState<User[]>([]);
  const [organizer, setOrganizer] = useState<User | null>(null);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [userToRemove, setUserToRemove] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [isAddUsersDialogOpen, setIsAddUsersDialogOpen] = useState(false);
  const [isDeleteEventDialogOpen, setIsDeleteEventDialogOpen] = useState<boolean>(false);
  const [isRemoveUserDialogOpen, setIsRemoveUserDialogOpen] = useState<boolean>(false);
  const [isRenameEventDialogOpen, setIsRenameEventDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsersAndOrganizerInCurrentEvent = async () => {
      const fetchedCurrentEvent = await getCurrentEvent(currentEventId as number);
      const fetchedUsers = fetchedCurrentEvent.users;
      const fetchedOrganizer = fetchedCurrentEvent.organizer;
      setUsers(fetchedUsers);
      setOrganizer(fetchedOrganizer);
    };

    fetchUsersAndOrganizerInCurrentEvent();
  }, [currentEventId]);

  const handlePerformDraw = () => {
    if (currentEventId) {
      performDraw(currentEventId);
    }
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 500);
  };

  // Open Dialogs
  const handleOpenCreateUserDialog = () => {
    setIsCreateUserDialogOpen(true);
  };

  const handleOpenAddUsersDialog = () => {
    setIsAddUsersDialogOpen(true);
  };

  const handleOpenDeleteUserDialog = (index: number): void => {
    const userToDelete = users[index];

    if (isAdministrator && userToDelete.id === userState.data?.id) {
      alert("Vous ne pouvez pas vous supprimer vous-même.");
    } else {
      setIsDeleteUserDialogOpen(true);
      setUserToDelete(index);
    }
  };

  const handleOpenDeleteEventDialog = () => {
    setIsDeleteEventDialogOpen(true);
  };

  const handleOpenRemoveUserDialog = (index: number): void => {
    const userToRemove = users[index];
    const isOrganizer = userState.data?.isOrganizerOfEvent;

    if (isOrganizer && userToRemove.id === userState.data?.id) {
      alert("En tant qu'organisateur·ice, vous ne pouvez pas vous retirer vous-même de l'événement.");
    } else {
      setIsRemoveUserDialogOpen(true);
      setUserToRemove(userToRemove.id);
    }
  };

  const handleOpenRenameEventDialog = () => {
    setIsRenameEventDialogOpen(true);
  };

  // Close Dialogs
  const handleCloseCreateUserDialog = () => {
    setIsCreateUserDialogOpen(false);
  };

  const handleCloseAddUsersDialog = () => {
    setIsAddUsersDialogOpen(false);
  };

  const handleCloseDeleteUserDialog = (): void => {
    setIsDeleteUserDialogOpen(false);
  };

  const handleCloseDeleteEventDialog = () => {
    setIsDeleteEventDialogOpen(false);
  };

  const handleCloseRemoveUserDialog = (): void => {
    setIsRemoveUserDialogOpen(false);
  };

  const handleCloseRenameEventDialog = (): void => {
    setIsRenameEventDialogOpen(false);
  };

  // API logics
  const handleCreateUser = async (newUserData: NewUser) => {
    const result = await createUser(newUserData);

    if (typeof result === "object" && result.id) {
      try {
        if (currentEventId) {
          await setUserToEvent(currentEventId, result.id);
        }
        setUsers((prevUsers) => [...prevUsers, result]);
        handleCloseCreateUserDialog();
        setErrors([]);
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur à l'événement", error);
      }
    } else if (typeof result === "string") {
      setErrors([result]);
    }

    handleCloseCreateUserDialog();
  };

  const handleAddUser = async (UsersId: number[]) => {
    if (currentEventId === null || currentEventId === undefined) {
      console.error("L'ID de l'événement courant n'est pas défini.");
      return;
    }

    if (UsersId.length === 0) {
      console.error("Aucun utilisateur n'a été sélectionné.");
      return;
    }

    const addUserPromises = UsersId.map(async (id) => {
      try {
        await setUserToEvent(currentEventId, id);
        console.log(`Utilisateur avec l'ID ${id} ajouté à l'événement.`);
      } catch (error) {
        console.error(`Erreur lors de l'ajout de l'utilisateur avec l'ID ${id} à l'événement`, error);
      }
    });

    try {
      await Promise.all(addUserPromises);
      console.log("Tous les utilisateurs ont été ajoutés à l'événement.");
    } catch (error) {
      console.error("Erreur lors de l'ajout des utilisateurs à l'événement", error);
    }

    handleCloseAddUsersDialog();
    window.location.href = "/admin";
  };

  const handleSetOrganizer = async (userId: number) => {
    const isOrganizer = organizer?.id === userId;

    if (!currentEventId) {
      console.error("Aucun évènement courant n'est défini");
      return;
    }

    if (!isOrganizer) {
      const previousOrganizer = organizer;
      const newOrganizer = users.find((user) => user.id === userId);
      setOrganizer(newOrganizer || null); // Optimistic update

      try {
        await setOrganizerOfEvent(currentEventId, userId);

        if (!isAdministrator) {
          window.location.href = "/dashboard";
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'organisateur", error);
        setOrganizer(previousOrganizer);
        setErrors(["Erreur lors de la mise à jour de l'organisateur."]);
      }
    }
  };

  const handleEditSubmit = async (index: number, newName: string, newEmail: string) => {
    if (!isValidEmail(newEmail)) {
      setErrors(["Le format de l'email n'est pas valide."]);
      return;
    }

    if (newName.trim() && newEmail.trim()) {
      const userToUpdate = users[index];
      const oldName = userToUpdate.username;
      const oldEmail = userToUpdate.email;

      // Optimistic update
      setUsers(users.map((user, idx) => (idx === index ? { ...user, username: newName, email: newEmail } : user)));

      const success = await updateUser(userToUpdate.id, { username: newName, email: newEmail });
      if (!success) {
        // If the API call fails, revert to old values
        setUsers(users.map((user, idx) => (idx === index ? { ...user, username: oldName, email: oldEmail } : user)));
        setErrors(["Erreur lors de la mise à jour de l'utilisateur."]);
      } else {
        setErrors([]);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (userToDelete !== null && userToDelete >= 0 && userToDelete < users.length) {
      const userIdToDelete = users[userToDelete].id;
      try {
        const success = await deleteUser(userIdToDelete);
        if (success) {
          setUsers((currentUsers) => currentUsers.filter((_, idx) => idx !== userToDelete));
        } else {
          console.error(`Échec de la suppression de l'utilisateur avec l'ID ${userIdToDelete}.`);
        }
      } catch (error) {
        console.error(`Erreur lors de la tentative de suppression de l'utilisateur avec l'ID ${userIdToDelete}:`, error);
      }
    } else {
      console.error("Index de l'utilisateur à supprimer est invalide ou non défini.");
    }

    handleCloseDeleteUserDialog();
  };

  const handleEditClick = (index: number): void => {
    setUsers(users.map((user, idx) => (idx === index ? { ...user, isEditing: true, editingText: user.username, editingEmail: user.email } : user)));
  };

  const handleDeleteEvent = (): void => {
    if (currentEventId) {
      deleteEvent(currentEventId);
    }

    handleCloseDeleteEventDialog();
    deleteCookie("selectedEventId");
    window.location.href = "/admin";
  };

  const handleRemoveUser = async (): Promise<void> => {
    if (userToRemove !== null && currentEventId) {
      try {
        await removeUserToEvent(currentEventId, userToRemove);
        setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userToRemove));
      } catch (error) {
        console.error(`Erreur lors de la suppression de l'utilisateur avec l'ID ${userToRemove} de l'événement`, error);
        setErrors(["Erreur lors de la suppression de l'utilisateur de l'événement."]);
      }

      handleCloseRemoveUserDialog();
    }
  };

  const handleRenameEvent = async (newEventName: string): Promise<void> => {
    if (currentEventId) {
      try {
        await renameEvent(currentEventId, newEventName);
        console.log("L'événement a été renommé avec succès :", newEventName);
        handleCloseRenameEventDialog();
        window.location.href = "/admin";
      } catch (error) {
        console.error("Erreur lors de la tentative de renommage de l'événement :", error);
        setErrors(["Erreur lors de la modification du nom de l'événement."]);
      }
    } else {
      console.error("L'ID de l'événement courant n'est pas défini.");
    }
  };

  return (
    <div className={styles["admin-container"]}>
      <div className={styles["menu-wrapper"]}>
        <MenuListAdmin
          onRenameEvent={handleOpenRenameEventDialog}
          onDeleteEvent={handleOpenDeleteEventDialog}
          onCreateUser={handleOpenCreateUserDialog}
          onAddUsers={handleOpenAddUsersDialog}
          onPerformDraw={handlePerformDraw}
          drawState={drawState}
        />
      </div>
      <h2 className={titan_one.className}>{currentEvent?.name}</h2>
      <p className={styles["admin-title"]}>Voici la liste des “enfants” sages qui ont le droit à un cadeau cette année :</p>

      {errors.length > 0 && (
        <div className={styles["error-message"]}>
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <div className={styles["admin-wrappers"]}>
        <div className={styles["users-wrapper"]}>
          <div className={styles["users-background"]}>
            <div className={styles["content"]}>
              <table className={styles["users"]}>
                <thead>
                  <tr>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <AdminUserItem
                      key={index}
                      user={user}
                      organizer={organizer}
                      index={index}
                      onEdit={handleEditClick}
                      onDelete={handleOpenDeleteUserDialog}
                      onRemove={handleOpenRemoveUserDialog}
                      onEditSubmit={handleEditSubmit}
                      updateUser={updateUser}
                      isAdministrator={isAdministrator}
                      onSetOrganizer={handleSetOrganizer}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <ConfirmationDialog
            text="Cet utilisateur·ice sera définitivement supprimé·e de l'application. Es-tu sûr·e de vouloir continuer ?"
            open={isDeleteUserDialogOpen}
            onClose={handleCloseDeleteUserDialog}
            onConfirm={handleDeleteUser}
          />
        </div>

        <CreateUserDialog open={isCreateUserDialogOpen} onClose={handleCloseCreateUserDialog} onConfirm={handleCreateUser} />

        <AddUsersDialog open={isAddUsersDialogOpen} onClose={handleCloseAddUsersDialog} onConfirm={handleAddUser} />

        <ConfirmationDialog
          text="Es-tu sûr·e de vouloir supprimer cet évènement ?"
          open={isDeleteEventDialogOpen}
          onClose={handleCloseDeleteEventDialog}
          onConfirm={handleDeleteEvent}
        />

        <ConfirmationDialog
          text="Es-tu sûr·e de vouloir retirer cet utilisateur·ice de l'évènement ?"
          open={isRemoveUserDialogOpen}
          onClose={handleCloseRemoveUserDialog}
          onConfirm={handleRemoveUser}
        />

        <RenameEventDialog
          open={isRenameEventDialogOpen}
          onClose={handleCloseRenameEventDialog}
          onConfirm={handleRenameEvent}
          currentEventName={currentEvent?.name || null}
        />
      </div>
    </div>
  );
}
