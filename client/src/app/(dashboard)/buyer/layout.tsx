"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  FileText,
  MessageSquare,
  User,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

interface BuyerLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "דף הבית", href: "/buyer/home", icon: Home },
  { name: "חיפוש רכבים", href: "/buyer/cars", icon: Search },
  { name: "פרסם בקשה", href: "/buyer/requests/new", icon: FileText },
  { name: "הבקשות שלי", href: "/buyer/requests", icon: MessageSquare },
  { name: "הפרופיל שלי", href: "/buyer/profile", icon: User },
];

export default function BuyerLayout({ children }: BuyerLayoutProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActivePath = (path: string) => {
    // Exact matches for all paths to avoid conflicts
    if (path === "/buyer/home") return pathname === "/buyer/home";
    if (path === "/buyer/cars") return pathname === "/buyer/cars";
    if (path === "/buyer/requests")
      return (
        pathname.startsWith("/buyer/requests") && !pathname.includes("/new")
      );
    if (path === "/buyer/requests/new")
      return pathname === "/buyer/requests/new";
    if (path === "/buyer/profile") return pathname === "/buyer/profile";

    return false;
  };

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    if (pathname === "/buyer/home") {
      return [{ name: "דף הבית", href: "/buyer/home" }];
    }

    // Generate breadcrumbs based on current path
    breadcrumbs.push({ name: "דף הבית", href: "/buyer/home" });

    if (pathname.startsWith("/buyer/cars")) {
      breadcrumbs.push({ name: "חיפוש רכבים", href: "/buyer/cars" });
      if (segments[2]) {
        breadcrumbs.push({ name: "פרטי רכב", href: pathname });
      }
    } else if (pathname.startsWith("/buyer/requests")) {
      breadcrumbs.push({ name: "הבקשות שלי", href: "/buyer/requests" });
      if (pathname.includes("/new")) {
        breadcrumbs.push({ name: "בקשה חדשה", href: "/buyer/requests/new" });
      }
    } else if (pathname.startsWith("/buyer/profile")) {
      breadcrumbs.push({ name: "הפרופיל שלי", href: "/buyer/profile" });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex h-full bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-xs text-gray-500">קונה פרטי</p>
              </div>
            </div>

            {/* Close button (mobile only) */}
            <button
              className="lg:hidden text-gray-400 hover:text-gray-600"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = isActivePath(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isActive ? "text-blue-600" : "text-gray-400"
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick stats or info */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-blue-900 mb-1">
                טיפ היום
              </h3>
              <p className="text-xs text-blue-700">
                השתמש בחיפוש המתקדם כדי למצוא בדיוק את הרכב שאתה מחפש
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 lg:mr-64">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 space-x-reverse text-sm">
              {breadcrumbs.map((breadcrumb, index) => (
                <div
                  key={breadcrumb.href}
                  className="flex items-center space-x-2 space-x-reverse"
                >
                  {index > 0 && (
                    <ChevronRight className="w-4 h-4 text-gray-400 rotate-180" />
                  )}
                  <Link
                    href={breadcrumb.href}
                    className={cn(
                      "hover:text-blue-600 transition-colors",
                      index === breadcrumbs.length - 1
                        ? "text-gray-900 font-medium"
                        : "text-gray-500"
                    )}
                  >
                    {breadcrumb.name}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="hidden sm:block text-xs text-gray-500">
                מחובר כקונה
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
