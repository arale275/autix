"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { carsApi } from "@/lib/api/cars";
import { formatCarTitle } from "@/lib/formatters";
import type { Car } from "@/lib/api/types";

interface DealerLayoutProps {
  children: React.ReactNode;
}

export default function DealerLayout({ children }: DealerLayoutProps) {
  const pathname = usePathname();
  const [carData, setCarData] = useState<Car | null>(null);
  const [isLoadingCar, setIsLoadingCar] = useState(false);

  // בדיקה אם זה דף רכב בודד או עריכה
  const isCarPage = pathname.match(/^\/dealer\/cars\/(\d+)$/);
  const isCarEditPage = pathname.match(/^\/dealer\/cars\/(\d+)\/edit$/);
  const carId = isCarPage?.[1] || isCarEditPage?.[1];

  // טעינת נתוני הרכב אם נחוץ
  useEffect(() => {
    if (carId && !carData) {
      setIsLoadingCar(true);
      carsApi
        .getCar(parseInt(carId))
        .then((car) => {
          setCarData(car);
        })
        .catch((error) => {
          console.error("Error loading car for breadcrumb:", error);
        })
        .finally(() => {
          setIsLoadingCar(false);
        });
    }
  }, [carId, carData]);

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    // דף הבית תמיד ראשון (אלא אם זה דף הבית עצמו)
    if (pathname === "/dealer/home") {
      return [{ name: "דף הבית", href: "/dealer/home" }];
    }

    breadcrumbs.push({ name: "דף הבית", href: "/dealer/home" });

    if (pathname.startsWith("/dealer/cars")) {
      breadcrumbs.push({ name: "הרכבים שלי", href: "/dealer/cars" });

      if (pathname.includes("/new")) {
        // דף פרסום רכב חדש
        breadcrumbs.push({ name: "פרסום רכב חדש", href: "/dealer/cars/new" });
      } else if (carId) {
        // דף רכב בודד או עריכה
        if (carData) {
          const carTitle = formatCarTitle(
            carData.make,
            carData.model,
            carData.year
          );
          breadcrumbs.push({
            name: carTitle,
            href: `/dealer/cars/${carId}`,
          });

          // אם זה דף עריכה נפרד, הוסף את "עריכת רכב"
          if (isCarEditPage) {
            breadcrumbs.push({
              name: "עריכת רכב",
              href: `/dealer/cars/${carId}/edit`,
            });
          }
        } else if (isLoadingCar) {
          // בזמן טעינה
          breadcrumbs.push({
            name: "טוען...",
            href: isCarEditPage
              ? `/dealer/cars/${carId}/edit`
              : `/dealer/cars/${carId}`,
          });

          // אם זה דף עריכה ואנחנו עדיין טוענים, הראה גם את העריכה
          if (isCarEditPage) {
            breadcrumbs.push({
              name: "עריכת רכב",
              href: `/dealer/cars/${carId}/edit`,
            });
          }
        } else {
          // fallback אם לא הצלחנו לטעון
          const fallbackName = isCarEditPage ? "עריכת רכב" : "פרטי רכב";
          breadcrumbs.push({
            name: fallbackName,
            href: isCarEditPage
              ? `/dealer/cars/${carId}/edit`
              : `/dealer/cars/${carId}`,
          });
        }
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
