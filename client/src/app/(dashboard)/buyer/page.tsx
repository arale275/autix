"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function BuyerRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to buyer home page
    router.replace("/buyer/home");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            מעביר לדף הבית
          </h2>
          <p className="text-gray-600">אנא המתן רגע...</p>
        </div>
      </div>
    </div>
  );
}
