"use client";

import styles from "./GifteeDetails.module.scss";
import { Titan_One } from "next/font/google";
import { Caveat } from "next/font/google";
import { useUser } from "@/app/context/UserContext";
import Loader from "@/app/components/Loader/Loader";
import Image from "next/image";
import { extractUrls } from "@/app/services/extractUrls";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });
const caveat = Caveat({ subsets: ["latin"], weight: ["400"] });

export default function GifteeDetails() {
  const { userState, currentEvent } = useUser();

  if (userState.loading) {
    return (
      <div className={styles["dashboard-wrapper"]}>
        <div className={styles["dashboard-background"]}>
          <Loader />
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className={styles["dashboard-wrapper"]}>
        <div className={styles["dashboard-background"]}>
          <p> {`Aucun événement sélectionné (ou l'événement n'existe pas).`}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["dashboard-wrapper"]}>
      <div className={styles["dashboard-background"]}>
        <div className={styles["content"]}>
          <div className={styles["title"]}>
            <p>Tu es le Père Noël de</p>
            <div className={`${styles["name"]} ${titan_one.className}`}>{currentEvent.santaOf ? currentEvent.santaOf : "..."}</div>
          </div>

          <div>
            <p>Voici les cadeaux qui lui feraient plaisir :</p>
          </div>

          <div className={`${styles["giftee-list"]} ${caveat.className}`}>
            {currentEvent.santaOfGiftList?.gifts && currentEvent.santaOfGiftList.gifts.length > 0 ? (
              <ul>
                {currentEvent.santaOfGiftList.gifts.map((gift) => {
                  const { newText, urls } = extractUrls(gift.name);
                  return (
                    <li key={gift.id}>
                      {urls.length > 0 ? (
                        <>
                          <a href={urls[0]} target="_blank" rel="noopener noreferrer" className={styles["icon-wrapper"]}>
                            <Image src="/icons/link.svg" alt="Link" width={20} height={20} />
                          </a>
                          {newText}
                        </>
                      ) : (
                        <>
                          <span className={styles["icon-wrapper"]}>
                            <Image src="/icons/dot.svg" alt="Dot" width={5} height={10} />
                          </span>
                          {newText}
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className={styles["no-gift"]}>
                😱 <br />
                {`Cette personne n'a pas encore ajouté de cadeaux à sa liste.`}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
