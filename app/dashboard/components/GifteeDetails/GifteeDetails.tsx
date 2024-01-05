"use client";

import { useState } from "react";
import styles from "./GifteeDetails.module.scss";
import { Titan_One } from "next/font/google";
import { Caveat } from "next/font/google";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });
const caveat = Caveat({ subsets: ["latin"], weight: ["400"] });

export default function GifteeDetails() {
  const [giftee, setGiftee] = useState([
    "Une cafetière",
    "Un cabriolet",
    "Un voyage en Picardie",
    "Des chaussettes",
    "Une cafetière",
    "Un cabriolet",
    "Un voyage en Picardie ptit cuicui",
    "Des chaussettes jolies et  r",
  ]);

  return (
    <div className={styles["dashboard-wrapper"]}>
      <div className={styles["dashboard-background"]}>
        <div className={styles["content"]}>
          <div className={styles["title"]}>
            <p>Tu es le père Noël de</p>
            <div className={`${styles["name"]} ${titan_one.className}`}>Alexis</div>
          </div>

          <div>
            <p> Voici les cadeaux qui lui feraient plaisir :</p>
          </div>

          <div className={`${styles["giftee-list"]} ${caveat.className}`}>
            <ul>
              {giftee.map((gift, index) => (
                <li key={gift + index}>- {gift}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
