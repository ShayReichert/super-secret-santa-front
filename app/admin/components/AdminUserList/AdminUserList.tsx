"use client";

import { useState, FormEvent, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import { useEvents } from "@/app/hook/useEvents/useEvents";
import styles from "./AdminUserList.module.scss";
import ConfirmationDialog from "@/app/components/ConfirmationDialog/ConfirmationDialog";
import AdminUserItem from "../AdminUserItem/AdminUserItem";
import { useUserList } from "@/app/hook/useUserList/useUserList";
import { isPasswordComplex, isValidEmail } from "@/app/services/inputValidator";
import MenuListAdmin from "../MenuListAdmin/MenuListAdmin";
import { Titan_One } from "next/font/google";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

export default function AdminUserList() {
  const { currentEvent, currentEventId, isAdministrator } = useUser();
  const { addUser, updateUser, deleteUser } = useUserList();
  const { getCurrentEvent, setOrganizerOfEvent } = useEvents();
  const [users, setUsers] = useState<User[]>([]);
  const [organizer, setOrganizer] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<NewUser>({ username: "", email: "", password: "" });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [disabledButton, setDisabledButton] = useState(true);

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

  useEffect(() => {
    setDisabledButton(!(newUser.username && newUser.password && newUser.email));
  }, [newUser]);

  const handleAddUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newUser.username.trim() || !newUser.email.trim()) {
      setErrors(["Le nom d'utilisateur et l'email ne peuvent pas être vides."]);
      return;
    }

    if (!isValidEmail(newUser.email)) {
      setErrors(["Le format de l'email n'est pas valide."]);
      return;
    }

    if (!newUser.password.trim()) {
      setErrors(["Le mot de passe ne peut pas être vide."]);
      return;
    }

    if (!isPasswordComplex(newUser.password)) {
      setErrors(["Le mot de passe doit faire au moins 8 caractères de chiffres ET de lettres."]);
      return;
    }

    const result = await addUser(newUser);

    if (typeof result === "string") {
      setErrors([result]);
    } else {
      setUsers([...users, result]);
      setNewUser({ username: "", email: "", password: "" });
      setErrors([]);
    }
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
    const success = await deleteUser(userToDelete.username);
    if (success) {
      setUsers(users.filter((_, idx) => idx !== index));
    }
  };

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

  const handleEditClick = (index: number): void => {
    setUsers(users.map((user, idx) => (idx === index ? { ...user, isEditing: true, editingText: user.username, editingEmail: user.email } : user)));
  };

  return (
    <div className={styles["admin-container"]}>
      <div className={styles["menu-wrapper"]}>
        <MenuListAdmin />
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
                  {[...users]
                    .sort((a, b) => {
                      if (a.username === organizer?.username) return -1; // Organizer first
                      if (b.username === organizer?.username) return 1; // Organizer first
                      return 0;
                    })
                    .map((user, index) => (
                      <AdminUserItem
                        key={index}
                        user={user}
                        organizer={organizer}
                        index={index}
                        onEdit={handleEditClick}
                        onDelete={openModal}
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
          <ConfirmationDialog text="Es-tu sûr·e de vouloir supprimer ce “user” ?" open={isModalOpen} onClose={closeModal} onConfirm={confirmDelete} />
        </div>

        <div className={styles["add-user-wrapper"]}>
          <div className={styles["add-user-background"]}>
            <div className={styles["content"]}>
              <form onSubmit={handleAddUser}>
                <div className={styles["form-group"]}>
                  <input
                    type="text"
                    placeholder="Prénom"
                    name="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    autoComplete="username"
                  />
                  <input
                    type="password"
                    placeholder="Code secret"
                    name="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    autoComplete="email"
                  />
                </div>
                <button type="submit" disabled={disabledButton} className={styles["button"]}>
                  AJOUTER
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
