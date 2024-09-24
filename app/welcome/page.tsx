import type { Metadata } from "next";
import Landing from "./components/Landing/Landing";

export const metadata: Metadata = {
  title: "Super Secret Santa",
  description: "Organise facilement un tirage au sort de Père Noël secret en ligne.",
};

export default function Welcome() {
  return <Landing />;
}
