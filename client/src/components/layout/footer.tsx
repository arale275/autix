"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Footer() {
  const { user, isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

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
            <h3 className="text-white font-medium text-sm mb-3">
              {isAuthenticated ? "הניווט שלי" : "הצטרף אלינו"}
            </h3>

            {/* For Buyers */}
            {isAuthenticated && user?.userType === "buyer" && (
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
            {isAuthenticated && user?.userType === "dealer" && (
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
            {!isAuthenticated && (
              <>
                <Link
                  href="/buyer/cars"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  צפה ברכבים
                </Link>
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
            <h3 className="text-white font-medium text-sm mb-3">מידע ותמיכה</h3>

            <Link
              href="/info/about"
              className="block text-gray-400 hover:text-white transition-colors text-sm"
            >
              אודות Autix
            </Link>

            <Link
              href="/info/contact"
              className="block text-gray-400 hover:text-white transition-colors text-sm"
            >
              צור קשר
            </Link>

            {/* Role-specific support */}
            {isAuthenticated && user?.userType === "dealer" && (
              <a
                href="mailto:dealers@autix.co.il"
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                תמיכה לסוחרים
              </a>
            )}

            {isAuthenticated && user?.userType === "buyer" && (
              <a
                href="mailto:support@autix.co.il"
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                תמיכה לקונים
              </a>
            )}

            {!isAuthenticated && (
              <a
                href="mailto:info@autix.co.il"
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                מידע כללי
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
                href="/info/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                תנאי שימוש
              </Link>
              <Link
                href="/info/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                מדיניות פרטיות
              </Link>
            </div>

            {/* User status indicator for logged in users */}
            {isAuthenticated && user && (
              <div className="text-gray-500 text-xs">
                מחובר כ{user.userType === "buyer" ? "קונה" : "סוחר"}:{" "}
                {user.firstName} {user.lastName}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
