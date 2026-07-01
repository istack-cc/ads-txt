import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";

const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "iStack",
  title: "iStack Free Apps - Android & iPhone Tools, No Account",
  description:
    "Browse 52 free iStack Android and iPhone apps for photos, documents, utilities, fitness, education, and voice tools. No account required for core features.",
  alternates: { canonical: "/" },
  verification: {
    google: "K_nylkNpeneEp5GXz4IvWbnOoiqg9kmVOCWazEPBNKU",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  keywords: [
    "iStack",
    "Android apps",
    "iOS apps",
    "Google Play",
    "App Store",
    "free mobile apps",
    "photo editing apps",
    "productivity apps",
    "fitness apps",
    "utility apps",
    "document reader android",
    "android utilities",
    "photo collage maker",
    "home workout app",
  ],
  openGraph: {
    title: "iStack Free Apps - Android & iPhone Tools, No Account",
    description:
      "Browse 52 free iStack Android and iPhone apps for photos, documents, utilities, fitness, education, and voice tools.",
    type: "website",
    url: "/",
    siteName: "iStack",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "iStack Free Apps - Android & iPhone Tools, No Account",
    description:
      "Browse 52 free iStack Android and iPhone apps for photos, documents, utilities, fitness, education, and voice tools.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
