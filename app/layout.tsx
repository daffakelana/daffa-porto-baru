import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from 'next/font/local'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/components/LanguageProvider";
import AppShell from "@/components/AppShell";

const sfPro = localFont({
  src: [
    {
      path: "./fonts/SF-Pro-Text-Ultralight.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/SF-Pro-Text-Thin.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/SF-Pro-Text-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/SF-Pro-Text-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/SF-Pro-Text-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/SF-Pro-Text-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/SF-Pro-Text-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/SF-Pro-Text-Heavy.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/SF-Pro-Text-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
  display: "swap",
});

const graphik = localFont({
  src: [
    {
      path: "./fonts/Graphik-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-graphik",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daffa Putra — User Interface Designer",
  description: "Portfolio of Daffa Putra, a User Interface Designer crafting user-centered digital products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sfPro.variable} ${graphik.variable} h-full antialiased`}
    >
     <body>
      <LanguageProvider>
        <AppShell>
          <Navbar />
          {children}
          <Footer />
        </AppShell>
      </LanguageProvider>
     </body>
    </html>
  );
}
