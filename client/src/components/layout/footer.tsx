"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
  phone: string;
  role: "dealer" | "buyer";
  businessName?: string;
  city: string;
}

export default function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Check if user is logged in on component mount and localStorage changes
    const checkAuthStatus = () => {
      const authToken = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user_data");

      if (authToken && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    // Check on component mount
    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_token" || e.key === "user_data") {
        checkAuthStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const userRole = user?.role;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-8 h-8 flex items-center justify-center">
                <img
                  src="/autix_logo.png"
                  alt="Autix"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-lg font-bold text-white">Autix</div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              הפלטפורמה המתקדמת לחיבור בין סוחרי רכב לקונים פרטיים
            </p>
            <div className="text-blue-400 font-medium text-sm">
              קונים. מוכרים. מרוויחים.
            </div>
          </div>

          {/* User Navigation */}
          <div className="space-y-3">
            {/* For Buyers */}
            {isLoggedIn && userRole === "buyer" && (
              <>
                <Link
                  href="/buyer/cars"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  חיפוש רכבים
                </Link>
                <Link
                  href="/buyer/post-request"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  פרסם "אני מחפש"
                </Link>
                <Link
                  href="/buyer/requests"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  המודעות וההודעות שלי
                </Link>
                <Link
                  href="/buyer/profile"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  הפרופיל שלי
                </Link>
              </>
            )}

            {/* For Dealers */}
            {isLoggedIn && userRole === "dealer" && (
              <>
                <Link
                  href="/dealer/cars"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  הרכבים שלי
                </Link>
                <Link
                  href="/dealer/add-car"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  פרסם רכב למכירה
                </Link>
                <Link
                  href="/dealer/buyers"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  קונים מחפשים
                </Link>
                <Link
                  href="/dealer/inquiries"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  הפניות שקיבלתי
                </Link>
                <Link
                  href="/dealer/profile"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  הפרופיל שלי
                </Link>
              </>
            )}

            {/* For non-logged in users */}
            {!isLoggedIn && (
              <>
                <Link
                  href="/auth/register"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  הרשם כקונה
                </Link>
                <Link
                  href="/auth/register"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  הרשם כסוחר
                </Link>
                <Link
                  href="/auth/login"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  התחבר לחשבון קיים
                </Link>
              </>
            )}
          </div>

          {/* Support & General */}
          <div className="space-y-3">
            <Link
              href="/info/contact"
              className="block text-gray-400 hover:text-white transition-colors text-sm"
            >
              צור קשר
            </Link>
            <Link
              href="/info/about"
              className="block text-gray-400 hover:text-white transition-colors text-sm"
            >
              אודות Autix
            </Link>
            {isLoggedIn && userRole === "dealer" && (
              <a
                href="mailto:dealers@autix.co.il"
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                תמיכה
              </a>
            )}
            {isLoggedIn && userRole === "buyer" && (
              <a
                href="mailto:support@autix.co.il"
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                תמיכה
              </a>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="text-gray-400 text-xs text-center md:text-right">
              כל הזכויות שמורות © Autix {currentYear}
            </div>

            <div className="flex space-x-4 space-x-reverse text-xs">
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                תנאי שימוש
              </Link>
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                מדיניות פרטיות
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
