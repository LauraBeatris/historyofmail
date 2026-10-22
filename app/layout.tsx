import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const display = localFont({
  src: [
    { path: "./fonts/abc-favorit-book.woff2", weight: "400" },
    { path: "./fonts/abc-favorit-medium.woff2", weight: "500" },
  ],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = localFont({
  src: "./fonts/commit-mono-regular.woff2",
  weight: "400",
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "History of Mail",
  description:
    "An interactive exhibit of the messages, protocols, and interfaces that turned a computer network into a way to reach anyone.",
  metadataBase: new URL("https://historyofmail.org"),
  openGraph: {
    title: "History of Mail",
    description:
      "An interactive exhibit of the messages, protocols, and interfaces that turned a computer network into a way to reach anyone.",
    url: "https://historyofmail.org",
    siteName: "History of Mail",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
