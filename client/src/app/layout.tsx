// client/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/variables.css";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { AuthProvider } from "@/contexts/AuthContext"; // הוספה חדשה

// אופטימיזציה לפונט
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // מונע FOIT (Flash of Invisible Text)
  preload: true,
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Autix - חיבור בין סוחרים לקונים",
    template: "%s | Autix",
  },
  description:
    "הפלטפורמה המתקדמת לחיבור בין סוחרי רכב לקונים פרטיים. חפש רכבים, פרסם בקשות רכישה וקבל הצעות ישירות מסוחרים מורשים.",
  keywords: [
    "רכבים",
    "מכירת רכבים",
    "קניית רכבים",
    "סוחרי רכב",
    "רכב יד שנייה",
    "מודעות רכב",
    "אני מחפש רכב",
    "פלטפורמת רכב",
  ],
  authors: [{ name: "Autix Team" }],
  creator: "Autix",
  publisher: "Autix",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: "https://autix.co.il",
    siteName: "Autix",
    title: "Autix - חיבור בין סוחרים לקונים",
    description:
      "הפלטפורמה המתקדמת לחיבור בין סוחרי רכב לקונים פרטיים. חפש רכבים או פרסם בקשות רכישה.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Autix - חיבור בין סוחרים לקונים",
    description:
      "הפלטפורמה המתקדמת לחיבור בין סוחרי רכב לקונים פרטיים. חפש רכבים או פרסם בקשות רכישה.",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={inter.variable}>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Viewport meta for better mobile performance */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />

        {/* Theme color */}
        <meta name="theme-color" content="#2563eb" />

        {/* Apple specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
