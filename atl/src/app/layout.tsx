import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Smart Queue & Appointment Manager",
  description: "Real-time queue tracking and seamless appointment scheduling for modern institutions.",
};

import { Navbar } from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased text-white/90 selection:bg-indigo-500/30 selection:text-indigo-200`}>
        <Providers>
          <Navbar />
          {/* Animated Background Orbs */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse [animation-delay:2s]" />
          </div>
          
          <main className="min-h-screen relative flex flex-col items-center justify-center p-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
