import type { Metadata } from "next";
import AdminUserList from "./components/AdminUserList/AdminUserList";

export const metadata: Metadata = {
  title: "Admin | Super Secret Santa",
  description: "Gestion des comptes utilisateurs",
};

export default function Admin() {
  return (
    <main id="main">
      <AdminUserList />
    </main>
  );
}
