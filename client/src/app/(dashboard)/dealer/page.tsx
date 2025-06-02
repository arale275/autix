// app-new/(dashboard)/dealer/page.tsx - Dealer Root Redirect Page
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function DealerRootPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // If not authenticated, redirect to login
        router.push("/login");
      } else if (user.userType !== "dealer") {
        // If not a dealer, redirect to appropriate home
        router.push("/buyer/home");
      } else {
        // If authenticated dealer, redirect to home
        router.push("/dealer/home");
      }
    }
  }, [user, isLoading, router]);

  // Show loading while redirecting
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              מעביר לפאנל הסוחר...
            </h2>
            <p className="text-gray-600">
              אנא המתן, אנחנו מכינים עבורך את הפאנל
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
