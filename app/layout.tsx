import "./styles/globals.scss";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { UserProvider } from "./context/UserContext";
import CookieBanner from "./components/CookieBanner/CookieBanner";
import { Analytics } from "@vercel/analytics/react";

const raleway = Raleway({ subsets: ["latin"], weight: ["300", "400", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://supersecretsanta.fr"),
  title: "Super Secret Santa",
  description: "Organisation de pères Noël secret en ligne",
  openGraph: {
    type: "website",
    url: "https://supersecretsanta.fr",
    title: "Super Secret Santa",
    description: "Organisation de pères Noël secret en ligne",
    images: [
      {
        url: "/opengraph_image.jpg",
        width: 800,
        height: 600,
        alt: "Super Secret Santa Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@supersecretsanta",
    title: "Super Secret Santa",
    description: "Organisation de pères Noël secret en ligne",
    images: "/opengraph_image.jpg",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: "width=device-width, initial-scale=1.0",
  alternates: {
    canonical: "https://supersecretsanta.fr",
  },
  other: {
    author: "Super Secret Santa Team",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={raleway.className}>
        <UserProvider>
          <Analytics />
          <Header />
          <CookieBanner />
          {children}
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
