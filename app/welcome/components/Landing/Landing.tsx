"use client";

import { Box, Tab, Tabs, Typography } from "@mui/material";
import { Titan_One } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Landing.module.scss";

const titan_one = Titan_One({ subsets: ["latin"], weight: ["400"] });

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

export default function Landing() {
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
          <div className={styles["content"]}>
            <h1 className={titan_one.className}>Organise un tirage de père noël secret rapidement et facilement !</h1>
            <Link className={styles["button"]} href="/login">
              Faire un tirage au sort
            </Link>
            <div className={styles["link-login"]}>
              Tu as déjà un compte ?{" "}
              <Link href="/login">
                <span>Connecte-toi</span>
              </Link>
            </div>
          </div>
        </div>
        <div className={`${styles["column"]} ${styles["column-image"]}`}>
          <div className={styles["image-container"]}>
            <Image src="/home/home-1.webp" alt="Super secret santa" fill sizes="auto" priority />
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
                <Image src="/home/1-3D.webp" alt="Crée un évènement" fill sizes="auto" />
              </div>
            </div>
            <div className={styles["card-content"]}>
              <Typography variant="h3" component="h3">
                1. Crée un évènement
              </Typography>
              <Typography>"Noël en famille" par exemple</Typography>
            </div>
          </div>
        </div>
        <div className={styles["column"]}>
          <div className={styles["card"]}>
            <div className={styles["card-image"]}>
              <div className={styles["image-container"]}>
                <Image src="/home/2-3D.webp" alt="Ajoute les participant·es" fill sizes="auto" />
              </div>
            </div>
            <div className={styles["card-content"]}>
              <Typography variant="h3" component="h3">
                2. Ajoute les participant·es
              </Typography>
              <Typography>Ajoute les emails de chaque participant·es</Typography>
            </div>
          </div>
        </div>
        <div className={styles["column"]}>
          <div className={styles["card"]}>
            <div className={styles["card-image"]}>
              <div className={styles["image-container"]}>
                <Image src="/home/3-3D.webp" alt="Fais le tirage au sort" fill sizes="auto" />
              </div>
            </div>
            <div className={styles["card-content"]}>
              <Typography variant="h3" component="h3">
                3. Fais le tirage au sort
              </Typography>
              <Typography>Et partage avec tes ami·es !</Typography>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles["section-wrapper"]} ${styles["section-title"]}`}>
        <h2 className={titan_one.className}>Une interface simple et intuitive !</h2>
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
                <Image src="/home/1-events.webp" alt="Gère tes évènements" fill sizes="auto" />
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className={styles["column"]}>
              <Typography variant="h3" component="h3">
                2. Ajoute tes proches
              </Typography>
              <Typography>
                Si tes proches ne sont pas inscrit·es sur l'app, crée-leur un compte pour qu'iels puissent participer au tirage au sort.
              </Typography>
            </div>
            <div className={`${styles["column"]} ${styles["column-image"]}`}>
              <div className={styles["image-container"]}>
                <Image src="/home/2-add-friends-cut.webp" alt="Ajoute facilement tes proches" fill sizes="auto" />
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <div className={styles["column"]}>
              <Typography variant="h3" component="h3">
                3. Fais le tirage au sort
              </Typography>
              <Typography>Lance le tirage au sort pour que chaque participant·e reçoive son père noël secret !</Typography>
            </div>
            <div className={`${styles["column"]} ${styles["column-image"]}`}>
              <div className={styles["image-container"]}>
                <Image src="/home/3-tirage-cut.webp" alt="Tirage au sort automatique" fill sizes="auto" />
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
                <Image src="/home/4-link-cut.webp" alt="Liens vers tes cadeaux" fill sizes="auto" />
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
              <Image src="/home/1-events.webp" alt="Gère tes évènements" fill sizes="auto" />
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
              <Image src="/home/2-add-friends-cut.webp" alt="Ajoute facilement tes proches" fill sizes="auto" />
            </div>
          </div>
          <div className={styles["mobile-block"]}>
            <Typography variant="h3" component="h3">
              🤖 Tirage au sort
            </Typography>
            <Typography>Lance le tirage au sort pour que chaque participant·e reçoive son père noël secret !</Typography>
            <div className={styles["image-container"]}>
              <Image src="/home/3-tirage-cut.webp" alt="Tirage au sort automatique" fill sizes="auto" />
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
              <Image src="/home/4-link-cut.webp" alt="Liens vers tes cadeaux" fill sizes="auto" />
            </div>
          </div>
        </section>
      )}

      <section className={`${styles["section-wrapper"]} ${styles["section-title"]}`}>
        <h2 className={titan_one.className}>Une démo vaut mieux que des mots 😊</h2>
      </section>

      <section className={`${styles["section-wrapper"]} ${styles["section-video"]}`}>
        <video muted loop controls>
          {/* <video autoPlay muted loop controls> */}
          <source src="/home/video-demo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      <section className={`${styles["section-wrapper"]} ${styles["section-title"]}`}>
        <Link className={styles["button"]} href="/login">
          Créer mon évènement
        </Link>
      </section>
    </main>
  );
}
