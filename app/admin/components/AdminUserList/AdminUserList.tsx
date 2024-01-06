"use client";

import { useState, useCallback, FormEvent } from "react";
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

  const handleEditClick = useCallback(
    (index: number): void => {
      setUsers(users.map((user, idx) => (idx === index ? { ...user, isEditing: true, editingText: user.name, editingEmail: user.email } : user)));
    },
    [users]
  );

  const handleEditSubmit = useCallback(
    (index: number, newName: string, newEmail: string): void => {
      // Si les deux valeurs sont vides, ne faites rien.
      if (!newName.trim() && !newEmail.trim()) {
        return;
      } else {
        // Sinon, mettez à jour l'utilisateur avec les nouvelles valeurs.
        setUsers(users.map((user, idx) => (idx === index ? { ...user, name: newName.trim(), email: newEmail.trim(), isEditing: false } : user)));
      }
    },
    [users]
  );

  const handleDelete = useCallback(
    (index: number): void => {
      setUsers(users.filter((_, idx) => idx !== index));
    },
    [users]
  );

  return (
    <div className={styles["admin-wrapper"]}>
      <div className={styles["admin-background"]}>
        <div className={styles["content"]}>
          <p>Voici la liste des “enfants” sages qui ont le droit à un cadeau cette année :</p>

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
                <AdminUserItem key={index} user={user} index={index} onEdit={handleEditClick} onDelete={openModal} onEditSubmit={handleEditSubmit} />
              ))}
            </tbody>
          </table>

          <form onSubmit={handleAddUser}>
            <div className={styles["form-group"]}>
              <input
                type="text"
                className=""
                placeholder="Prénom"
                name="userName"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                autoComplete="username"
              />
              <input
                type="password"
                className=""
                placeholder="Code secret"
                name="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
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
      <ConfirmationDialog open={isModalOpen} onClose={closeModal} onConfirm={confirmDelete} />
    </div>
  );
}
