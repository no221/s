import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelompok 1",
  description: "Yakin dari tadi dengerin?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased overflow-hidden bg-black">
        {children}
      </body>
    </html>
  );
}
