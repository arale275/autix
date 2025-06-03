import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Autix",
    default: "Autix - פלטפורמה לחיבור בין סוחרי רכב לקונים",
  },
  description:
    "הפלטפורמה המתקדמת לחיבור בין סוחרי רכב לקונים פרטיים. מצא את הרכב המושלם או פרסם את הרכב שלך למכירה.",
  keywords: [
    "רכבים למכירה",
    "קניית רכב יד שנייה",
    "סוחרי רכב",
    "רכב משומש",
    "מכירת רכב",
    "חיפוש רכבים",
    "autix",
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
    title: "Autix - פלטפורמה לחיבור בין סוחרי רכב לקונים",
    description: "הפלטפורמה המתקדמת לחיבור בין סוחרי רכב לקונים פרטיים",
    siteName: "Autix",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Autix - קונים. מוכרים. מרוויחים.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Autix - פלטפורמה לחיבור בין סוחרי רכב לקונים",
    description: "הפלטפורמה המתקדמת לחיבור בין סוחרי רכב לקונים פרטיים",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://autix.co.il",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="color-scheme" content="light" />

        {/* Viewport meta for mobile optimization */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

        {/* Preload critical resources */}
        <link rel="preload" href="/autix_logo.png" as="image" />
      </head>

      <body
        className={`${inter.className} antialiased bg-gray-50 text-gray-900`}
      >
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:z-50"
        >
          דלג לתוכן הראשי
        </a>

        {/* Global Providers */}
        <AuthProvider>
          {/* Layout Structure */}
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main id="main-content" className="flex-1 flex flex-col">
              {children}
            </main>

            {/* Footer */}
            <Footer />
          </div>

          {/* Global Toast Notifications */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#fff",
                color: "#374151",
                border: "1px solid #e5e7eb",
                fontSize: "14px",
                fontFamily: inter.style.fontFamily,
              },
            }}
            richColors
            closeButton
            expand
          />
        </AuthProvider>

        {/* Service Worker Registration (for PWA in the future) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered: ', registration);
                  }).catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
                });
              }
            `,
          }}
        />

        {/* Analytics placeholder */}
        {process.env.NODE_ENV === "production" && (
          <>
            {/* Google Analytics */}
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'GA_MEASUREMENT_ID');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
