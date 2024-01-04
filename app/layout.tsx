import "./styles/globals.scss";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

const raleway = Raleway({ subsets: ["latin"], weight: ["300", "400", "700"] });

export const metadata: Metadata = {
  title: "Super Secret Santa",
  description: "Plaisir d'offrir, joie de décevoir",
  // openGraph: {
  //   ...{ images: ["/images/pere_noel.webp"] },
  // },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={raleway.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
