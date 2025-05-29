// client/src/components/layout/header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  User,
  LogOut,
  Car,
  Search,
  MessageSquare,
  FileText,
  Settings,
} from "lucide-react";
import { apiClient } from "@/lib/api";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: "dealer" | "buyer";
  dealerProfile?: {
    businessName: string;
    city?: string;
  };
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in the same tab)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    // Listen for custom events when user logs in
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-changed", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-changed", handleAuthChange);
    };
  }, []);

  // Also check auth status when pathname changes (after login redirect)
  useEffect(() => {
    if (!isLoading) {
      checkAuthStatus();
    }
  }, [pathname]);

  const checkAuthStatus = async () => {
    try {
      const authToken = localStorage.getItem("auth_token");

      if (!authToken) {
        setIsLoggedIn(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      console.log("Found token, verifying with server..."); // Debug log

      // Verify token with server
      const response = await apiClient.getProfile();

      if (response.success && response.data) {
        console.log("Token verified, user:", response.data.firstName); // Debug log
        setUser(response.data);
        setIsLoggedIn(true);

        // Update localStorage with fresh data
        localStorage.setItem(
          "user_data",
          JSON.stringify({
            name: `${response.data.firstName} ${response.data.lastName}`,
            email: response.data.email,
            phone: response.data.phone || "",
            role: response.data.userType,
            businessName: response.data.dealerProfile?.businessName || "",
            city: response.data.dealerProfile?.city || "",
          })
        );
      } else {
        console.log("Token invalid, clearing storage"); // Debug log
        // Token is invalid, clear storage
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);

      // Only clear on 401/403 errors (token invalid)
      if (
        error instanceof Error &&
        (error.message.includes("401") ||
          error.message.includes("403") ||
          error.message.includes("גישה נדחתה"))
      ) {
        console.log("Auth error, clearing storage"); // Debug log
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
        setIsLoggedIn(false);
        setUser(null);
      } else {
        // For network errors, keep existing state but stop loading
        console.log("Network error, keeping existing state"); // Debug log
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation for different user types
  const getNavigation = () => {
    if (!isLoggedIn || !user) {
      return [];
    }

    if (user.userType === "dealer") {
      return [
        { name: "דף הבית", href: "/dealer/home", icon: null },
        { name: "הרכבים שלי", href: "/dealer/cars", icon: Car },
        { name: "פרסם רכב", href: "/dealer/add-car", icon: FileText },
        { name: "קונים מחפשים", href: "/dealer/buyers", icon: Search },
        {
          name: "הפניות שקיבלתי",
          href: "/dealer/inquiries",
          icon: MessageSquare,
        },
        { name: "הפרופיל שלי", href: "/dealer/profile", icon: Settings },
      ];
    }

    if (user.userType === "buyer") {
      return [
        { name: "דף הבית", href: "/buyer/home", icon: null },
        { name: "חיפוש רכבים", href: "/buyer/cars", icon: Search },
        {
          name: "פרסם מה אני מחפש",
          href: "/buyer/post-request",
          icon: FileText,
        },
        {
          name: "המודעות וההודעות שלי",
          href: "/buyer/requests",
          icon: Car,
        },
        { name: "הפרופיל שלי", href: "/buyer/profile", icon: Settings },
      ];
    }

    return [];
  };

  const navigation = getNavigation();

  const isActivePath = (path: string) => {
    if (path === "/") return pathname === "/";
    if (path === "/dealer/home" && pathname === "/dealer/home") return true;
    if (path === "/buyer/home" && pathname === "/buyer/home") return true;
    return pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");

    // Update state
    setIsLoggedIn(false);
    setUser(null);

    // Trigger auth change event
    window.dispatchEvent(new Event("auth-changed"));

    // Redirect to home page
    router.push("/");
  };

  const getUserDisplayName = () => {
    if (!user) return "משתמש";
    return user.firstName || "משתמש";
  };

  const getUserRole = () => {
    if (!user) return "";
    return user.userType === "dealer" ? "סוחר" : "קונה פרטי";
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-10 h-10 flex items-center justify-center">
                <img
                  src="/autix_logo.png"
                  alt="Autix"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-xl font-bold text-gray-800">Autix</div>
            </div>

            {/* Loading indicator */}
            <div className="animate-pulse">
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <Link
              href="/"
              className="flex items-center space-x-2 space-x-reverse"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <img
                  src="/autix_logo.png"
                  alt="Autix"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-xl font-bold text-gray-800">Autix</div>
            </Link>
          </div>

          {/* Desktop Navigation - Only for logged in users */}
          {isLoggedIn && navigation.length > 0 && (
            <div className="hidden md:flex items-center space-x-6 space-x-reverse">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 space-x-reverse font-medium transition-colors duration-200 ${
                    isActivePath(item.href)
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            {isLoggedIn && user ? (
              <>
                {/* User Profile */}
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Link
                    href={
                      user.userType === "dealer"
                        ? "/dealer/profile"
                        : "/buyer/profile"
                    }
                    className="flex items-center space-x-2 space-x-reverse hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800">
                        {getUserDisplayName()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getUserRole()}
                      </div>
                    </div>
                  </Link>

                  {/* Logout Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600"
                    title="התנתק"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">התחבר</Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    הרשם
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              aria-label="תפריט"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {/* Navigation Links - Only for logged in users */}
              {isLoggedIn && navigation.length > 0 && (
                <div className="space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 space-x-reverse px-4 py-2 rounded-md font-medium transition-colors ${
                        isActivePath(item.href)
                          ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon && <item.icon className="w-5 h-5" />}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* User Section */}
              {isLoggedIn && user ? (
                <div className="border-t border-gray-200 pt-4">
                  <div className="px-4 pb-3">
                    <Link
                      href={
                        user.userType === "dealer"
                          ? "/dealer/profile"
                          : "/buyer/profile"
                      }
                      className="flex items-center space-x-3 space-x-reverse hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="bg-blue-100 p-3 rounded-full">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-base font-medium text-gray-800">
                          {getUserDisplayName()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getUserRole()}
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="px-4">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 space-x-reverse w-full text-right px-2 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>התנתק</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 space-y-2 px-4">
                  <Link
                    href="/auth/login"
                    className="block w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full">
                      התחבר
                    </Button>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      הרשם
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
