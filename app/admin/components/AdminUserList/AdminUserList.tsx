"use client";

import { useState, FormEvent } from "react";
import styles from "./AdminUserList.module.scss";
import ConfirmationDialog from "@/app/components/ConfirmationDialog/ConfirmationDialog";
import AdminUserItem from "../AdminUserItem/AdminUserItem";

export default function AdminUserList() {
  const [users, setUsers] = useState<User[]>([
    { name: "Alexis", email: "alexis.mathiot@gmail.com", isEditing: false, editingText: "", editingEmail: "" },
    { name: "Nicole", email: "nicole.gaillot@laposte.net", isEditing: false, editingText: "", editingEmail: "" },
    { name: "Nathalie", email: "xxxx.xxxxxxx@gmail.com", isEditing: false, editingText: "", editingEmail: "" },
  ]);
  const [newUser, setNewUser] = useState<{ name: string; email: string; password: string }>({ name: "", email: "", password: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

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

  const handleAddUser = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (newUser.name.trim() && newUser.email.trim()) {
      setUsers([...users, { ...newUser, isEditing: false, editingText: "", editingEmail: "" }]);
      setNewUser({ name: "", email: "", password: "" });
    }
  };

  const handleEditClick = (index: number): void => {
    setUsers(users.map((user, idx) => (idx === index ? { ...user, isEditing: true, editingText: user.name, editingEmail: user.email } : user)));
  };

  const handleEditSubmit = (index: number, newName: string, newEmail: string): void => {
    if (!newName.trim() && !newEmail.trim()) {
      return;
    } else {
      setUsers(users.map((user, idx) => (idx === index ? { ...user, name: newName.trim(), email: newEmail.trim(), isEditing: false } : user)));
    }
  };

  const handleDelete = (index: number): void => {
    setUsers(users.filter((_, idx) => idx !== index));
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
