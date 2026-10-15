import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Veritas Academic — Platform Pemeriksa Tulisan Ilmiah",
  description: "Platform cerdas dan privat untuk pemeriksaan tata bahasa, kemiripan naskah, dan analisis penulisan akademik.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="h-screen w-screen overflow-hidden flex flex-col bg-[#FDFDFE]">
        {children}
      </body>
    </html>
  );
}
