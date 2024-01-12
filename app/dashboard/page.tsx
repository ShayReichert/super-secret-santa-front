import type { Metadata } from "next";
import styles from "./page.module.scss";
import GifteeDetails from "./components/GifteeDetails/GifteeDetails";
import UserWishlist from "./components/UserWishlist/UserWishlist";
import SantaImage from "../components/SantaImage/SantaImage";

// export const metadata: Metadata = {
//   title: "Dashboard | Super Secret Santa",
//   description: "À qui vas-tu faire un cadeau ? Quels cadeaux veux-tu ?",
// };

export default function Dashboard() {
  return (
    <main id="main" className={styles["main"]}>
      <GifteeDetails />
      <UserWishlist />
      <SantaImage />
    </main>
  );
}
