import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Stinger from "@/public/stinger.png";
import { Toaster } from "@/components/ui/toaster";
import HeaderButtons from "@/components/ui/appNavButton";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white`}
      >
        <header className="fixed top-0 left-0 w-full z-50 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src={Stinger}
                alt="CU Stinger Image"
                width={60}
                height={45}
                className="mr-4"
              />
              <h1 className="text-2xl font-bold tracking-tight">
                Cedarville Supermileage Live Telemetry
              </h1>
            </div>
            <HeaderButtons />
          </div>
        </header>
        <main className="pt-28 max-w-7xl mx-auto px-6">
          {children}
        </main>

        <Toaster />
      </body>
    </html>
  );
}