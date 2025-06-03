"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingState from "@/components/states/LoadingState";

export default function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      console.error("OAuth Error:", error);
      router.push("/login?error=google_auth_failed");
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));

        // שמור את הטוקן ומידע המשתמש
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // עדכן את הקונטקסט
        login(user, token);

        // הפנה לפי סוג המשתמש
        if (user.userType === "dealer") {
          router.push("/dealer/home");
        } else {
          router.push("/buyer/home");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/login?error=invalid_response");
      }
    } else {
      router.push("/login?error=missing_data");
    }
  }, [searchParams, router, login]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingState message="מחבר אותך..." />
    </div>
  );
}
