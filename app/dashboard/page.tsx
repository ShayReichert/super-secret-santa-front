import type { Metadata } from "next";
import GifteeeDetails from "./components/GifteeDetails/GifteeDetails";
import UserWishlist from "./components/UserWishlist/UserWishlist";

export const metadata: Metadata = {
  title: "Dashboard | Super Secret Santa",
  description: "À qui vas-tu faire un cadeau ? Quels cadeaux veux-tu ?",
};

export default function Dashboard() {
  return (
    <main id="main">
      <GifteeeDetails />
      <UserWishlist />
    </main>
  );
}
