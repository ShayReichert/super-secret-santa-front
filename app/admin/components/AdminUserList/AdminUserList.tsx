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

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

export default function AdminUserList() {
  const { userState, currentEvent, currentEventId, isAdministrator } = useUser();
  const { createUser, updateUser, deleteUser } = useUserList();
  const { getCurrentEvent, setOrganizerOfEvent, setUserToEvent } = useEvents();
  const { drawState, performDraw } = useDraw();
  const [users, setUsers] = useState<User[]>([]);
  const [organizer, setOrganizer] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [isAddUsersDialogOpen, setIsAddUsersDialogOpen] = useState(false);

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
  };

  const handleOpenCreateUserDialog = () => {
    setIsCreateUserDialogOpen(true);
  };

  const handleOpenAddUsersDialog = () => {
    setIsAddUsersDialogOpen(true);
  };

  const handleCloseCreateUserDialog = () => {
    setIsCreateUserDialogOpen(false);
  };

  const handleCloseAddUsersDialog = () => {
    setIsAddUsersDialogOpen(false);
  };

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

  const handleDelete = async (index: number) => {
    const userToDelete = users[index];
    const success = await deleteUser(userToDelete.id);
    if (success) {
      setUsers(users.filter((_, idx) => idx !== index));
    }
  };

  const openDeleteDialog = (index: number): void => {
    const userToDelete = users[index];

    if (isAdministrator && userToDelete.id === userState.data?.id) {
      alert("Vous ne pouvez pas vous supprimer vous-même.");
    } else {
      setIsDeleteDialogOpen(true);
      setItemToDelete(index);
    }
  };

  const closeDeleteDialog = (): void => {
    setIsDeleteDialogOpen(false);
  };

  const confirmDelete = (): void => {
    if (itemToDelete !== null) handleDelete(itemToDelete);
    closeDeleteDialog();
  };

  const handleEditClick = (index: number): void => {
    setUsers(users.map((user, idx) => (idx === index ? { ...user, isEditing: true, editingText: user.username, editingEmail: user.email } : user)));
  };

  return (
    <div className={styles["admin-container"]}>
      <div className={styles["menu-wrapper"]}>
        <MenuListAdmin
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
                      onDelete={openDeleteDialog}
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
            text="Es-tu sûr·e de vouloir supprimer ce “user” ?"
            open={isDeleteDialogOpen}
            onClose={closeDeleteDialog}
            onConfirm={confirmDelete}
          />
        </div>

        <CreateUserDialog open={isCreateUserDialogOpen} onClose={handleCloseCreateUserDialog} onConfirm={handleCreateUser} />
        <AddUsersDialog open={isAddUsersDialogOpen} onClose={handleCloseAddUsersDialog} onConfirm={handleAddUser} />
      </div>
    </div>
  );
}
