"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import React, { useState } from "react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import {
  BsMask,
  BsCircle,
  BsBriefcaseFill,
  BsMortarboardFill,
  BsTerminalFill,
  BsSubstack,
  BsLink45Deg,
  BsEmojiWink,
} from "react-icons/bs";

import Link from "next/link";

import Darko from "@/svg/darko";

import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"], display: "swap" });

type ThemeMode = "dark" | "light";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mode, setMode] = useState<ThemeMode>("dark");

  const toggleMode = () => {
    switch (mode) {
      case "dark":
        setMode("light");
        break;
      case "light":
        setMode("dark");
        break;
    }
  };

  return (
    <QueryProvider>
      <html lang="en" className={inter.className}>
        <body
          className={`${mode} bg-white dark:bg-dark text-dark dark:text-white transition-bg`}
        >
          <ReactQueryDevtools initialIsOpen={false} />
          <div className={"flex gap-6 w-screen h-screen overflow-hidden p-12"}>
            <div className={"flex flex-col gap-5"}>
              <div
                className={
                  "flex flex-col gap-4 items-center text-dark w-12 h-full box"
                }
              >
                <Link href={"/experience"}>
                  <BsBriefcaseFill />
                </Link>
                <Link href={"/education"}>
                  <BsMortarboardFill />
                </Link>
                <Link href={"/projects"}>
                  <BsTerminalFill />
                </Link>
                <Link href={"/blog"}>
                  <BsSubstack />
                </Link>
                <Link href={"/socials"}>
                  <BsLink45Deg />
                </Link>
                <Link href={"/me"}>
                  <BsEmojiWink />
                </Link>

                <div className={"flex-1"} />
                <button onClick={toggleMode}>
                  {mode === "dark" ? <BsMask /> : <BsCircle />}
                </button>
              </div>
              <div>
                <Link href={"/"}>
                  <Darko className={"h-12 w-12 fill-dark dark:fill-white"} />
                </Link>
              </div>
            </div>
            <div className={"flex flex-1 box"}>{children}</div>
          </div>
        </body>
      </html>
    </QueryProvider>
  );
}
