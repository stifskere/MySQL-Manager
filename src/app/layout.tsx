import type { Metadata } from 'next';

import { Inter } from 'next/font/google';
import { NextFont } from "next/dist/compiled/@next/font";

import WithChildren from "@/types/props/WithChildren";

import {ReactElement} from "react";

import "primereact/resources/themes/bootstrap4-dark-purple/theme.css";
import "./layout.css";

const inter: NextFont = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'MySQL manager',
	description: 'A small MySQL database administrator (dba)'
};

export default function RootLayout({children}: WithChildren): ReactElement {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
