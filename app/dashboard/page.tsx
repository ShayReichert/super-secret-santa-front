import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Super Secret Santa",
  description: "À qui vas-tu faire un cadeau ? Quels cadeaux veux-tu ?",
};

export default function Dashboard() {
  return <main id="main">Dashboard</main>;
}
