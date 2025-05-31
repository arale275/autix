"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "אימייל הוא שדה חובה";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "אימייל לא תקין";
    }

    if (!formData.password) {
      newErrors.password = "סיסמה היא שדה חובה";
    } else if (formData.password.length < 6) {
      newErrors.password = "סיסמה חייבת להכיל לפחות 6 תווים";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await login(formData.email, formData.password);

      if (response.success) {
        console.log("🎉 Login successful via AuthContext!");

        // AuthContext handles all the token/user storage
        // Just navigate based on user type
        // We need to get the updated user from AuthContext
        // Since login is async, we'll use a small delay to ensure state is updated
        setTimeout(() => {
          // User state should be updated by now
          const currentUser = user; // This should be updated by AuthContext

          // Navigate based on user role from the response or current user
          if (formData.email.includes("dealer")) {
            router.push("/dealer/home");
          } else {
            router.push("/buyer/home");
          }
        }, 100);
      } else {
        setErrors({
          general: response.message || "שגיאה בהתחברות",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "שגיאה בהתחברות. בדוק את החיבור לשרת.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="w-12 h-12 flex items-center justify-center">
              <img
                src="/autix_logo.png"
                alt="Autix"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">התחברות</h2>
          <p className="text-gray-600">התחבר לחשבון שלך ב-Autix</p>
        </div>

        {/* General Error Display */}
        {errors.general && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 ml-2" />
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Login Form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <Label htmlFor="email">כתובת אימייל</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="example@email.com"
                    className="pr-10"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <Label htmlFor="password">סיסמה</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="הזן סיסמה"
                    className="pr-10 pl-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    מתחבר...
                  </>
                ) : (
                  "התחבר"
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                אין לך חשבון?{" "}
                <Link
                  href="/auth/register"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  הרשם כאן
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 ml-1" />
            חזור לדף הבית
          </Link>
        </div>

        {/* Test Accounts Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-800">
              חשבונות לבדיקה (מהדאטהבייס)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-blue-700 space-y-1">
            <div>• buyer@test.com / 123456 (קונה)</div>
            <div>• dealer@test.com / 123456 (סוחר)</div>
            <div className="text-blue-600 mt-2">חשבונות אמיתיים מהשרת</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
