import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Stinger from "@/public/stinger.png";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CU Supermileage Pits Display",
  description: "Car data display for Cedarville Supermileage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="fixed top-0 left 0 w-full z-10 bg-white shadow-md">
          <Card className="w-fit-content p-5 flex align-content-center items-center">
            <Image src={Stinger} alt="CU Stinger Image" width={50} height={30} className="mr-5" />
            <h1 className="text-2xl w-auto font-bold">Cedarville Supermileage Live Telemetry</h1>
          </Card>
        </header>
        <main className="pt-30">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
