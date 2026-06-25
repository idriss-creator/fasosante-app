import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWAProvider from "@/components/PWAProvider";

export const metadata: Metadata = {
  title: "FASOSANTÉ - Votre santé à portée de main",
  description: "Plateforme de santé au Burkina Faso.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FASOSANTÉ",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        {/* ✅ IMPORTANT : Charger Material Icons */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />

        {/* Meta tags pour iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FASOSANTÉ" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="antialiased">
        <PWAProvider /> {/* ✅ CETTE LIGNE DOIT ÊTRE PRÉSENTE */}
        {children}
      </body>
    </html>
  );
}