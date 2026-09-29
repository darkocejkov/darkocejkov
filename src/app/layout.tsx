import type { Metadata } from "next";
import { Rubik, Funnel_Display } from "next/font/google";
import Scene from "@/components/eye/Scene";
import MaintenanceBanner from "@/components/MaintenanceBanner";
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme'),d=window.matchMedia('(prefers-color-scheme:dark)').matches;if(t==='dark'||(t===null&&d))document.documentElement.classList.add('dark');})()` }} />
      </head>
      <body className={`${rubik.variable} ${funnelDisplay.variable} theme-fade grain flex min-h-screen flex-col font-sans bg-brand-white text-brand-dark dark:bg-brand-dark dark:text-brand-white`}>
        <Scene maintenanceBanner={<MaintenanceBanner />}>{children}</Scene>
      </body>
    </html>
  );
}
