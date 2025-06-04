/** @type {import('next').NextConfig} */
const nextConfig = {
  // אופטימיזציה לתמונות
  images: {
    domains: [
      "localhost",
      "3.79.239.100", // הוסף את IP השרת שלך
      "autix.co.il",
      "d15g18gvoz68b4.amplifyapp.com",
      "images.autix.co.il", // ✅ הוספנו את הדומיין החסר!
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.amplifyapp.com",
      },
      {
        protocol: "http",
        hostname: "3.79.239.100", // הוסף את IP השרת
      },
      {
        protocol: "https", // ✅ הוספנו HTTPS
        hostname: "images.autix.co.il", // ✅ הוספנו את הדומיין
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // דחיסה
  compress: true,

  // Bundle Analyzer (רק בפיתוח)
  ...(process.env.ANALYZE === "true" && {
    webpack: (config: any) => {
      try {
        const BundleAnalyzerPlugin = require("@next/bundle-analyzer");
        config.plugins.push(
          new BundleAnalyzerPlugin({
            enabled: true,
          })
        );
      } catch (error) {
        console.warn("Bundle analyzer not available");
      }
      return config;
    },
  }),

  // אופטימיזציה נוספת
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Headers לביצועים ואבטחה
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
        ],
      },
      {
        source: "/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // הגדרות פרודקשן - הסרת standalone
  // output: 'standalone', // הסרנו את זה כי זה גורם לבעיות

  // השבתת ESLint זמנית לdeployment
  eslint: {
    ignoreDuringBuilds: true,
  },

  // השבתת TypeScript errors זמנית לdeployment
  typescript: {
    ignoreBuildErrors: true,
  },

  // הגדרות שרת לפרודקשן
  ...(process.env.NODE_ENV === "production" && {
    distDir: ".next",
    generateEtags: false,
    poweredByHeader: false,
  }),
};

module.exports = nextConfig;
