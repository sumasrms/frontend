import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createMetadata } from "@/lib/metadata";
import Header from "@/components/header";
import Providers from "@/components/providers";
import { BackgroundRippleEffect } from "@/components/background-ripple-effect";

export const metadata: Metadata = createMetadata({
  title: {
    template: "%s | Better Auth",
    default: "Better Auth",
  },
  description: "The most comprehensive authentication framework for TypeScript",
  metadataBase: new URL("https://demo.better-auth.com"),
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        <Providers>
          <div className="min-h-[calc(100vh-3.5rem)] mt-14 w-full relative">
            <Header />
            <div className="absolute inset-0 z-0">
              <BackgroundRippleEffect />
            </div>
            <div className="relative z-10 ">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
