"use client";

import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import styles from "./CookieBanner.module.scss";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowBanner(false);
  };

  return (
    showBanner && (
      <div className={styles["cookie-banner"]}>
        <div className={styles["cookie-consent"]}>
          <p>
            Nous utilisons des cookies essentiels pour assurer le bon fonctionnement de notre site. En utilisant notre site, vous acceptez notre
            utilisation des cookies essentiels.
          </p>
          <a href="#" className={styles["accept-button"]} onClick={handleAccept}>
            OK
          </a>
        </div>
      </div>
    )
  );
};

export default CookieBanner;
