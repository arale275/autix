"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Home,
  Car,
  Plus,
  MessageSquare,
  User,
  Menu,
  X,
  ChevronRight,
  Building2,
} from "lucide-react";

interface DealerLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "דף הבית", href: "/dealer/home", icon: Home },
  { name: "הרכבים שלי", href: "/dealer/cars", icon: Car },
  { name: "פרסם רכב", href: "/dealer/cars/new", icon: Plus },
  { name: "פניות מקונים", href: "/dealer/inquiries", icon: MessageSquare },
  { name: "הפרופיל שלי", href: "/dealer/profile", icon: User },
];

export default function DealerLayout({ children }: DealerLayoutProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActivePath = (path: string) => {
    // Exact matches for all paths to avoid conflicts
    if (path === "/dealer/home") return pathname === "/dealer/home";
    if (path === "/dealer/cars") return pathname === "/dealer/cars";
    if (path === "/dealer/cars/new") return pathname === "/dealer/cars/new";
    if (path === "/dealer/inquiries") return pathname === "/dealer/inquiries";
    if (path === "/dealer/profile") return pathname === "/dealer/profile";

    return false;
  };

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    if (pathname === "/dealer/home") {
      return [{ name: "דף הבית", href: "/dealer/home" }];
    }

    // Generate breadcrumbs based on current path
    breadcrumbs.push({ name: "דף הבית", href: "/dealer/home" });

    if (pathname.startsWith("/dealer/cars")) {
      breadcrumbs.push({ name: "הרכבים שלי", href: "/dealer/cars" });
      if (pathname.includes("/new")) {
        breadcrumbs.push({ name: "פרסום רכב חדש", href: "/dealer/cars/new" });
      } else if (segments[2] && segments[2] !== "new") {
        breadcrumbs.push({ name: "עריכת רכב", href: pathname });
      }
    } else if (pathname.startsWith("/dealer/inquiries")) {
      breadcrumbs.push({ name: "פניות מקונים", href: "/dealer/inquiries" });
    } else if (pathname.startsWith("/dealer/profile")) {
      breadcrumbs.push({ name: "הפרופיל שלי", href: "/dealer/profile" });
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
          {/* Mobile close button only */}
          <div className="flex items-center justify-end p-4 border-b border-gray-200 lg:hidden">
            <button
              className="text-gray-400 hover:text-gray-600"
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
                      ? "bg-purple-50 text-purple-600 border-r-2 border-purple-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isActive ? "text-purple-600" : "text-gray-400"
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick actions */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            {/* Quick action button */}
            <Link
              href="/dealer/cars/new"
              className="flex items-center justify-center space-x-2 space-x-reverse w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">פרסם רכב חדש</span>
            </Link>
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
                      "hover:text-purple-600 transition-colors",
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
          </div>
        </div>
      </div>

      {/* Page content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
