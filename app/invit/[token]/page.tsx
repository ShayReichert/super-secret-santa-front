"use client";

import styles from "./page.module.scss";
import { useEffect, useState, useRef } from "react";
import { useEvents } from "@/app/hook/useEvents/useEvents";
import { Titan_One } from "next/font/google";
import SantaImage from "../../components/SantaImage/SantaImage";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

export default function Invit({ params }: { params: { token: string } }) {
  const token = params.token;
  const { checkTokenAndAddToEvent } = useEvents();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasExecutedRef = useRef(false); // Ref to track execution

  useEffect(() => {
    const addToEvent = async () => {
      if (hasExecutedRef.current) return; // Prevent re-execution
      hasExecutedRef.current = true; // Mark as executed

      try {
        await checkTokenAndAddToEvent(token);
      } catch (error) {
        setError("Erreur lors de l'ajout à l'évènement");
      } finally {
        setIsLoading(false);
      }
    };
    addToEvent();
  }, [token, checkTokenAndAddToEvent]);

  if (isLoading) {
    return (
      <main className={`${styles["main"]} ${styles["loading"]}`}>
        <div>Chargement... </div>
      </main>
    );
  }

  if (error) {
    return (
      <main id="main" className={styles["main"]}>
        <div className={styles["confirm-add-to-event-wrapper"]}>
          <div className={styles["confirm-add-to-event"]}>
            <h2 className={titan_one.className}>Erreur lors de l'ajout à l'évènement</h2>
            <br />
            <p>Vérifie que tu ne participes pas déjà à l'évènement ou que le lien d'invitation n'a pas expiré.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className={styles["main"]}>
      <div className={styles["confirm-add-to-event-wrapper"]}>
        <div className={styles["confirm-add-to-event"]}>
          <h2 className={titan_one.className}>Vous avez été ajouté à l'évènement !</h2>
        </div>
      </div>
      <SantaImage />
    </main>
  );
}
