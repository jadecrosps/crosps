import type { Metadata } from "next";
import { saans, daVinci } from "@/lib/fonts";
import { Agentation } from "agentation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crosps | Real Vegetables, Unreal Crunch",
  description:
    "Crosps are whole vegetables thoughtfully transformed into gluten-free, plant based crisps that prove vegetables can be extraordinary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${saans.variable} ${daVinci.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
