import type { Metadata } from "next";
import Script from "next/script";
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

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mohit-exe.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "MOHIT.EXE v2.0 | 198X_ENGINEER_STATION",
  description: "Production-ready retro 8-bit operating system portfolio, AI lab, and arcade game center.",
  keywords: ["portfolio", "full-stack engineer", "AI", "Next.js", "React", "developer"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MOHIT.EXE v2.0 | 198X_ENGINEER_STATION",
    description: "Retro-inspired portfolio with a terminal UI, AI lab, project showcase, and arcade experiences.",
    url: appUrl,
    siteName: "MOHIT.EXE",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "MOHIT.EXE portfolio preview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MOHIT.EXE v2.0 | 198X_ENGINEER_STATION",
    description: "Retro-inspired portfolio with a terminal UI, AI lab, project showcase, and arcade experiences.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/manifest.webmanifest",
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
        <Script id="structured-data" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Mohit Kishore",
            jobTitle: "Full-Stack Engineer",
            url: appUrl,
            sameAs: ["https://github.com", "https://linkedin.com"],
            description: "Engineer building polished web products, AI experiences, and retro-inspired interfaces.",
          })}
        </Script>
      </body>
    </html>
  );
}
