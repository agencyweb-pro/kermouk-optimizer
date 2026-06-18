import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SITE_URL = "https://kermouk.gg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kermouk Optimizer — Tweaks Fortnite & Windows #1",
    template: "%s | Kermouk Optimizer",
  },
  description:
    "Kermouk Optimizer, les meilleurs tweaks pour booster ton FPS sur Fortnite. Optimisation Windows, réseau, GPU. Version gratuite et premium disponibles.",
  keywords: [
    "tweaks kermouk",
    "kermouk optimizer",
    "kermouk fortnite",
    "booster fps fortnite",
    "optimisation pc fortnite",
    "tweaks windows gaming",
    "optimizer fortnite gratuit",
    "réduire ping fortnite",
    "fps boost windows",
    "tweaks tcp ip gaming",
    "optimiser pc gaming",
  ],
  authors: [{ name: "Kermouk Optimizer" }],
  creator: "Kermouk Optimizer",
  publisher: "Kermouk Optimizer",
  category: "Gaming",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Kermouk Optimizer",
    title: "Kermouk Optimizer — Tweaks Fortnite & Windows #1",
    description:
      "Les meilleurs tweaks pour booster ton FPS sur Fortnite. Optimisation Windows, réseau, GPU. Gratuit et premium.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kermouk Optimizer — Tweaks Fortnite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kermouk Optimizer — Tweaks Fortnite & Windows #1",
    description:
      "Les meilleurs tweaks pour booster ton FPS sur Fortnite. Gratuit et premium.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark text-white font-inter">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
