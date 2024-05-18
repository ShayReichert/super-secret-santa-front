"use client";

import { useState, useEffect } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import type { Metadata } from "next";
import styles from "./page.module.scss";
import Link from "next/link";
import Image from "next/image";
import { Titan_One } from "next/font/google";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

// export const metadata: Metadata = {
//   title: "Super Secret Santa",
//   description: "Organise facilement tes Pères Noël secret en ligne",
// };

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      className={styles["tab-panel"]}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

export default function Welcome() {
  const [value, setValue] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main id="main" className={styles["main"]}>
      <section className={`${styles["section-wrapper"]} ${styles["section-presentation"]}`}>
        <div className={styles["column"]}>
          <div>
            <h1 className={titan_one.className}>Organise des tirages de pères noël secrets rapidement et facilement !</h1>
            <Link className={styles["button"]} href="/login">
              Faire un tirage au sort
            </Link>
          </div>
        </div>
        <div className={`${styles["column"]} ${styles["column-image"]}`}>
          <div className={styles["image-container"]}>
            <Image src="/home/home-1.webp" alt="Super secret santa" fill sizes="100vw" />
          </div>
        </div>
      </section>

      <section className={`${styles["section-wrapper"]} ${styles["section-title"]}`}>
        <h2 className={titan_one.className}>Comment ça marche ?</h2>
      </section>

      <section className={`${styles["section-wrapper"]} ${styles["section-features"]}`}>
        <div className={styles["column"]}>
          <div className={styles["card"]}>
            <div className={styles["card-image"]}>
              <div className={styles["image-container"]}>
                <Image src="/home/1-dalle-event.webp" alt="Crée un évènement" fill sizes="100vw" />
              </div>
            </div>
            <div className={styles["card-content"]}>
              <Typography variant="h3" component="h3">
                1. Crée un évènement
              </Typography>
              <Typography>"Noël en famille", "Noël entre ami·es", "Noël au travail", etc.</Typography>
            </div>
          </div>
        </div>
        <div className={styles["column"]}>
          <div className={styles["card"]}>
            <div className={styles["card-image"]}>
              <div className={styles["image-container"]}>
                <Image src="/home/2-dalle-friends.webp" alt="Ajoute les participant·es" fill sizes="100vw" />
              </div>
            </div>
            <div className={styles["card-content"]}>
              <Typography variant="h3" component="h3">
                2. Ajoute les participant·es
              </Typography>
              <Typography>Ajoute les emails de chaque participant·es.</Typography>
            </div>
          </div>
        </div>
        <div className={styles["column"]}>
          <div className={styles["card"]}>
            <div className={styles["card-image"]}>
              <div className={styles["image-container"]}>
                <Image src="/home/3-dalle-tel.webp" alt="Fais le tirage au sort" fill sizes="100vw" />
              </div>
            </div>
            <div className={styles["card-content"]}>
              <Typography variant="h3" component="h3">
                3. Fais le tirage au sort
              </Typography>
              <Typography>Lance le tirage au sort et partage avec tes ami·es !</Typography>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles["section-wrapper"]} ${styles["section-title"]}`}>
        <h2 className={titan_one.className}>Une interface fun, accessible et agréable !</h2>
      </section>

      {!isMobile && (
        <section className={`${styles["section-wrapper"]} ${styles["tabs-root"]}`}>
          <Tabs className={styles["tabs"]} value={value} onChange={handleChange} aria-label="advantages tabs">
            <Tab label="📆 Gère tes évènements" {...a11yProps(0)} />
            <Tab label="👥 Ajoute tes proches" {...a11yProps(1)} />
            <Tab label="🤖 Tirage au sort" {...a11yProps(2)} />
            <Tab label="🎁 Liens externe vers tes cadeaux" {...a11yProps(3)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <div className={styles["column"]}>
              <Typography variant="h3" component="h3">
                1. Gère tes évènements
              </Typography>
              <Typography>Retrouve tous tes pères noël secrets au même endroit.</Typography>
            </div>
            <div className={`${styles["column"]} ${styles["column-image"]}`}>
              <div className={styles["image-container"]}>
                <Image src="/home/1-events.webp" alt="Gère tes évènements" fill sizes="100vw" />
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className={styles["column"]}>
              <Typography variant="h3" component="h3">
                2. Ajoute facilement tes proches
              </Typography>
              <Typography>
                Si tes proches ne sont pas inscrit·es sur l'app, crée-leur un compte, puis ajoute leurs emails pour qu'iels puissent participer au
                tirage au sort.
              </Typography>
            </div>
            <div className={`${styles["column"]} ${styles["column-image"]}`}>
              <div className={styles["image-container"]}>
                <Image src="/home/2-add-friends-cut.webp" alt="Ajoute facilement tes proches" fill sizes="100vw" />
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <div className={styles["column"]}>
              <Typography variant="h3" component="h3">
                3. Tirage au sort
              </Typography>
              <Typography>Lance le tirage au sort pour que chaque participant·e reçoive son père noël secret !</Typography>
            </div>
            <div className={`${styles["column"]} ${styles["column-image"]}`}>
              <div className={styles["image-container"]}>
                <Image src="/home/3-tirage-cut.webp" alt="Tirage au sort automatique" fill sizes="100vw" />
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <div className={styles["column"]}>
              <Typography variant="h3" component="h3">
                4. Ajoute des liens vers tes cadeaux facilement
              </Typography>
              <Typography>
                Ajoute un lien vers le cadeau que tu souhaites directement dans ta liste : l'url est transformée en lien cliquable !
              </Typography>
            </div>
            <div className={`${styles["column"]} ${styles["column-image"]}`}>
              <div className={styles["image-container"]}>
                <Image src="/home/4-link-cut.webp" alt="Liens vers tes cadeaux" fill sizes="100vw" />
              </div>
            </div>
          </TabPanel>
        </section>
      )}

      {isMobile && (
        <section className={`${styles["section-wrapper"]} ${styles["mobile-section"]}`}>
          <div className={styles["mobile-block"]}>
            <Typography variant="h3" component="h3">
              📆 Gère tes évènements
            </Typography>
            <Typography>Retrouve tous tes pères noël secrets au même endroit.</Typography>
            <div className={styles["image-container"]}>
              <Image src="/home/1-events.webp" alt="Gère tes évènements" fill sizes="100vw" />
            </div>
          </div>
          <div className={styles["mobile-block"]}>
            <Typography variant="h3" component="h3">
              👥 Ajoute tes proches
            </Typography>
            <Typography>
              Si tes proches ne sont pas inscrit·es sur l'app, crée-leur un compte, puis ajoute leurs emails pour qu'iels puissent participer au
              tirage au sort.
            </Typography>
            <div className={styles["image-container"]}>
              <Image src="/home/2-add-friends-cut.webp" alt="Ajoute facilement tes proches" fill sizes="100vw" />
            </div>
          </div>
          <div className={styles["mobile-block"]}>
            <Typography variant="h3" component="h3">
              🤖 Tirage au sort
            </Typography>
            <Typography>Lance le tirage au sort pour que chaque participant·e reçoive son père noël secret !</Typography>
            <div className={styles["image-container"]}>
              <Image src="/home/3-tirage-cut.webp" alt="Tirage au sort automatique" fill sizes="100vw" />
            </div>
          </div>
          <div className={styles["mobile-block"]}>
            <Typography variant="h3" component="h3">
              🎁 Liens externe vers tes cadeaux
            </Typography>
            <Typography>
              Ajoute un lien vers le cadeau que tu souhaites directement dans ta liste : l'url est transformée en lien cliquable !
            </Typography>
            <div className={styles["image-container"]}>
              <Image src="/home/4-link-cut.webp" alt="Liens vers tes cadeaux" fill sizes="100vw" />
            </div>
          </div>
        </section>
      )}

      <section className={`${styles["section-wrapper"]} ${styles["section-title"]}`}>
        <Link className={styles["button"]} href="/login">
          Créer un évènement
        </Link>
      </section>
    </main>
  );
}
