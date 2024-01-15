"use client";

import { useState, FormEvent, useEffect } from "react";
import styles from "./AdminUserList.module.scss";
import ConfirmationDialog from "@/app/components/ConfirmationDialog/ConfirmationDialog";
import AdminUserItem from "../AdminUserItem/AdminUserItem";
import { useUserList } from "@/app/hook/useUserList";

export default function AdminUserList() {
  const { getUsers, addUser, updateUser, deleteUser } = useUserList();
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<NewUser>({ username: "", email: "", password: "" });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newUser.username.trim() && newUser.password.trim() && newUser.email.trim()) {
      const addedUser = await addUser(newUser);
      if (addedUser) {
        setUsers([...users, addedUser]);
        setNewUser({ username: "", email: "", password: "" });
      }
    }
  };

  const handleEditSubmit = async (index: number, newName: string, newEmail: string) => {
    if (newName.trim() && newEmail.trim()) {
      const userToUpdate = users[index];
      const oldName = userToUpdate.username;
      const oldEmail = userToUpdate.email;

      // Mise à jour optimiste
      setUsers(users.map((user, idx) => (idx === index ? { ...user, username: newName, email: newEmail } : user)));

      // Appel API
      const success = await updateUser(userToUpdate.username, { username: newName, email: newEmail });
      if (!success) {
        // Si l'appel API échoue, rétablir les anciennes valeurs
        setUsers(users.map((user, idx) => (idx === index ? { ...user, username: oldName, email: oldEmail } : user)));
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
      <p>Voici la liste des “enfants” sages qui ont le droit à un cadeau cette année :</p>

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
                    className=""
                    placeholder="Prénom"
                    name="userName"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    autoComplete="username"
                  />
                  {/* TODO : vérifier la force du mot de passe */}
                  <input
                    type="password"
                    className=""
                    placeholder="Code secret"
                    name="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                  {/* TODO : vérifier la validité de l'email */}
                  <input
                    type="email"
                    className=""
                    placeholder="Email"
                    name="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    autoComplete="email"
                  />
                </div>
                <button type="submit" className={styles["button"]}>
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
