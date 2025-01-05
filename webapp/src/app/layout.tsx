import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
	title: "Darko Cejkov",
	description: "Professional developer/engineer",
};

export default function RootLayout({
									   children,
								   }: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<html lang="en" className={inter.className}>
			<body className={'bg-stone-900'}>
				<div className={'w-screen h-screen overflow-hidden'}>
					<Navbar direction={'top'}>
						<Link href={'/exp'}>
							experience
						</Link>
						<Link href={'/edu'}>
							education
						</Link>
						<Link href={'/proj'}>
							projects
						</Link>
					</Navbar>

					<div className={`z-10 top-10 min-h-[calc(100vh-5rem)] absolute w-screen px-10`}>
						{children}
					</div>

					<Navbar direction={'bottom'}>
						<Link href={'/soci'}>
							socials
						</Link>
						<Link href={'/me'}>
							me
						</Link>
					</Navbar>
				</div>
			</body>
		</html>
	);
}
