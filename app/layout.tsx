import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ImpreEdil & Project S.r.l.",
  description:
    "Ristrutturazioni, costruzioni e interventi edili seguiti con serietà, precisione e attenzione ai dettagli.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
