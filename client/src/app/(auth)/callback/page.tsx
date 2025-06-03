"use client";

import { Suspense } from "react";
import CallbackContent from "./CallbackContent";
import LoadingState from "@/components/states/LoadingState";

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingState message="טוען..." />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
