"use client";

import { useState } from "react";
import styles from "./GifteeDetails.module.scss";
import { Titan_One } from "next/font/google";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

export default function GifteeeDetails() {
  const [giftee, setGiftee] = useState(["Une cafetière", "Un cabriolet", "Un voyage en Picardie", "Des chaussettes"]);

  return (
    <div className={styles["dashboard-page"]}>
      <div className={styles["giftee-details"]}>
        <div className={styles["content"]}>
          <div>
            <p>Tu es le père Noël de</p>
            <div className={titan_one.className}>Alexis</div>
          </div>

          <div>
            <p> Voici les cadeaux qui lui feraient plaisir :</p>
          </div>

          <div>
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
