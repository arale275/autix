"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface DealerLayoutProps {
  children: React.ReactNode;
}

export default function DealerLayout({ children }: DealerLayoutProps) {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    if (pathname === "/dealer/home") {
      return [{ name: "דף הבית", href: "/dealer/home" }];
    }

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
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="container mx-auto">
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

      {/* Page content */}
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
