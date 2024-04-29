import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web2LoginProvider } from "./Web2LoginProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Web2LoginProvider>
        <body className={inter.className}>{children}</body>
      </Web2LoginProvider>
    </html>
  );
}
