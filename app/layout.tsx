import "./styles/globals.scss";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { UserProvider } from "./context/UserContext";

const raleway = Raleway({ subsets: ["latin"], weight: ["300", "400", "700"] });

export const metadata: Metadata = {
  title: "Super Secret Santa",
  description: "Plaisir d'offrir, joie de décevoir",
  openGraph: {
    images: "/opengraph_image.webp",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={raleway.className}>
        <UserProvider>
          <Header />
          {children}
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
