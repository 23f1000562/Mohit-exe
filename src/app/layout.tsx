import type { Metadata } from "next";
import { Space_Mono, JetBrains_Mono, Courier_Prime } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "MOHIT.EXE v2.0 | 198X_ENGINEER_STATION",
  description: "Production-ready retro 8-bit operating system portfolio, AI lab, and arcade game center.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceMono.variable} ${jetbrainsMono.variable} ${courierPrime.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col crt-screen crt-flicker selection:bg-primary selection:text-on-primary">
        <div className="scanlines"></div>
        {children}
      </body>
    </html>
  );
}
