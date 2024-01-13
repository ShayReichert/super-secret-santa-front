"use client";

import styles from "./GifteeDetails.module.scss";
import { Titan_One } from "next/font/google";
import { Caveat } from "next/font/google";
import { useUser } from "@/app/context/UserContext";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });
const caveat = Caveat({ subsets: ["latin"], weight: ["400"] });

export default function GifteeDetails() {
  const { userState } = useUser();

  return (
    <div className={styles["dashboard-wrapper"]}>
      <div className={styles["dashboard-background"]}>
        <div className={styles["content"]}>
          <div className={styles["title"]}>
            <p>Tu es le père Noël de</p>
            <div className={`${styles["name"]} ${titan_one.className}`}>{userState.data?.SantaOf}</div>
          </div>

          <div>
            <p> Voici les cadeaux qui lui feraient plaisir :</p>
          </div>

          <div className={`${styles["giftee-list"]} ${caveat.className}`}>
            <ul>
              {userState.data?.SantaOfGiftsLists.map((gift) => (
                <li key={gift.id}>- {gift.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
