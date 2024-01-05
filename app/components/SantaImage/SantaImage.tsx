import Image from "next/image";
import styles from "./SantaImage.module.scss";

export default function SantaImage() {
  return <Image className={styles["santa-image"]} src="/pere_noel.webp" alt="Le père Noël" width={301} height={263} priority />;
}
