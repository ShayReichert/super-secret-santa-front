import type { Metadata } from "next";
import AdminUserList from "./components/AdminUserList/AdminUserList";
import SantaImage from "../components/SantaImage/SantaImage";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Admin | Super Secret Santa",
  description: "Gestion des comptes utilisateurs",
};

export default function Admin() {
  return (
    <main id="main" className={styles["main"]}>
      <AdminUserList />
      <SantaImage />
    </main>
  );
}

// TODO : voir si on peut créer une fonction fetchUserRole() pour vérifier le rôle de l'utilisateur
// Si oui, essayer de l'appeler dans getServerSideProps() pour vérifier le rôle de l'utilisateur
// Si l'utilisateur n'est pas administrateur, on le redirige vers la page dashboard

// export async function getServerSideProps(context) {
//   // Exemple d'appel API pour vérifier le rôle
//   const role = await fetchUserRole(context.req.headers.authorization);

//   if (role !== "ADMIN") {
//     // Rediriger l'utilisateur s'il n'est pas administrateur
//     return {
//       redirect: {
//         destination: "/dashboard", // Ou une autre page
//         permanent: false,
//       },
//     };
//   }

//   return { props: {} }; // Les données nécessaires pour la page
// }
