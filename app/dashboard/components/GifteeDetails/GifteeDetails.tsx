"use client";

import styles from "./GifteeDetails.module.scss";
import { Titan_One } from "next/font/google";
import { Caveat } from "next/font/google";
import { useUser } from "@/app/context/UserContext";
import Loader from "@/app/components/Loader/Loader";
import Link from "next/link";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });
const caveat = Caveat({ subsets: ["latin"], weight: ["400"] });

export default function GifteeDetails() {
  const { userState } = useUser();

  if (userState.loading) {
    return (
      <div className={styles["dashboard-wrapper"]}>
        <div className={styles["dashboard-background"]}>
          <Loader />
        </div>
      </div>
    );
  }

  if (!userState.data) {
    return (
      <div className={styles["dashboard-wrapper"]}>
        <div className={styles["dashboard-background"]}>
          <div className={styles["error-content"]}>
            <div className={styles["error"]}>Vous n'êtes pas connecté·e !</div>
            <Link href="/login">Se connecter</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["dashboard-wrapper"]}>
      <div className={styles["dashboard-background"]}>
        <div className={styles["content"]}>
          <div className={styles["title"]}>
            <p>Tu es le père Noël de</p>
            <div className={`${styles["name"]} ${titan_one.className}`}>{userState.data?.SantaOf ? userState.data?.SantaOf : "..."}</div>
          </div>

          <div>
            <p> Voici les cadeaux qui lui feraient plaisir :</p>
          </div>

          <div className={`${styles["giftee-list"]} ${caveat.className}`}>
            <ul>
              {userState.data?.SantaOfGiftsLists && userState.data?.SantaOfGiftsLists.length > 0 ? (
                <ul>
                  {userState.data?.SantaOfGiftsLists.map((gift) => (
                    <li key={gift.id}>- {gift.name}</li>
                  ))}
                </ul>
              ) : (
                <p className={styles["no-gift"]}>
                  😱 <br />
                  Cette personne n'a pas encore ajouté de cadeaux à sa liste
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
