"use client";

import { useState, FormEvent, useEffect } from "react";
import styles from "./AdminUserList.module.scss";
import ConfirmationDialog from "@/app/components/ConfirmationDialog/ConfirmationDialog";
import AdminUserItem from "../AdminUserItem/AdminUserItem";
import { useUserList } from "@/app/hook/useUserList";
import { isValidEmail } from "@/app/services/inputValidator";
import MenuListAdmin from "../MenuListAdmin/MenuListAdmin";

export default function AdminUserList() {
  const { getUsers, addUser, updateUser, deleteUser } = useUserList();
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<NewUser>({ username: "", email: "", password: "" });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [disabledButton, setDisabledButton] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setDisabledButton(!(newUser.username && newUser.password && newUser.email));
  }, [newUser]);

  const handleAddUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newUser.username.trim() && newUser.password.trim() && newUser.email.trim()) {
      const result = await addUser(newUser);

      if (typeof result === "string") {
        setErrors([result]);
      } else {
        setUsers([...users, result]);
        setNewUser({ username: "", email: "", password: "" });
        setErrors([]);
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

      const success = await updateUser(userToUpdate.username, { username: newName, email: newEmail });
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
                      index={index}
                      onEdit={handleEditClick}
                      onDelete={openModal}
                      onEditSubmit={handleEditSubmit}
                      updateUser={updateUser}
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
                  {/* TODO : vérifier la force du mot de passe */}
                  <input
                    type="password"
                    placeholder="Code secret"
                    name="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                  {/* TODO : vérifier la validité de l'email */}
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
