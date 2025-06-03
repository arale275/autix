"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Car, Users } from "lucide-react";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

// Loading component for Suspense fallback
function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">טוען...</p>
      </div>
    </div>
  );
}

// Main login component that uses useSearchParams
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading, user } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const redirectTo = searchParams.get("redirect");
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        // Redirect to appropriate dashboard
        const dashboardUrl =
          user.userType === "dealer" ? "/dealer/home" : "/buyer/home";
        router.push(dashboardUrl);
      }
    }
  }, [isAuthenticated, isLoading, user, router, searchParams]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "אימייל נדרש";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "פורמט אימייל לא תקין";
    }

    if (!formData.password) {
      newErrors.password = "סיסמה נדרשת";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast.success("התחברת בהצלחה!");
        // Redirect will happen in useEffect
      } else {
        toast.error(result.message || "שגיאה בהתחברות");
      }
    } catch (error) {
      toast.error("אירעה שגיאה בהתחברות");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (userType: "buyer" | "dealer") => {
    setIsSubmitting(true);

    const demoCredentials = {
      buyer: { email: "test@example.com", password: "123456" },
      dealer: { email: "dealer@test.com", password: "123456" },
    };

    try {
      const credentials = demoCredentials[userType];
      const result = await login(credentials.email, credentials.password);

      if (result.success) {
        toast.success(
          `התחברת כ${userType === "dealer" ? "סוחר" : "קונה"} לדוגמה!`
        );
      } else {
        toast.error("שגיאה בהתחברות לחשבון דוגמה");
      }
    } catch (error) {
      toast.error("אירעה שגיאה");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">בודק התחברות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 space-x-reverse text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span>חזרה לדף הבית</span>
          </Link>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            התחברות לחשבון
          </h2>
          <p className="text-gray-600">היכנס לאזור האישי שלך</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">התחבר לחשבון</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="flex items-center space-x-2 space-x-reverse"
                >
                  <Mail className="w-4 h-4" />
                  <span>אימייל</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="example@email.com"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="flex items-center space-x-2 space-x-reverse"
                >
                  <Lock className="w-4 h-4" />
                  <span>סיסמה</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="הכנס סיסמה"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    מתחבר...
                  </>
                ) : (
                  "התחבר"
                )}
              </Button>
            </form>

            {/* Google Login Section */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    או
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <GoogleLoginButton />
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                אין לך חשבון?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  הרשם עכשיו
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 החיבור מאובטח ומוצפן. הפרטים שלך מוגנים.
          </p>
        </div>
      </div>
    </div>
  );
}

// Main export component with Suspense wrapper
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  );
}
