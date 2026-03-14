import type { Metadata } from "next";
import { Rubik, Funnel_Display } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  variable: "--font-funnel-display",
});

export const metadata: Metadata = {
  title: "Darko Cejkov",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} ${funnelDisplay.variable} flex min-h-screen flex-col font-sans`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
