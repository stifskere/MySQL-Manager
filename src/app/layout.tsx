import type { Metadata } from 'next';

import { Inter } from 'next/font/google';
import { NextFont } from "next/dist/compiled/@next/font";

import WithChildren from "@/types/props/WithChildren";

const inter: NextFont = Inter({ subsets: ['latin'] });

import "./layout.css";

export const metadata: Metadata = {
	title: 'MySQL manager',
	description: 'A small MySQL database administrator (dba)',
};

export default function RootLayout({children}: WithChildren) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
