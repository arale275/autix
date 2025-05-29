"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  AlertCircle,
  Phone,
  User,
  Building,
  MapPin,
  Shield,
} from "lucide-react";

interface RegistrationData {
  accountType: "buyer" | "dealer";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  businessName: string;
  city: string;
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get type from URL params or default to buyer
  const initialAccountType =
    searchParams.get("type") === "dealer" ? "dealer" : "buyer";

  const [formData, setFormData] = useState<RegistrationData>({
    accountType: initialAccountType,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    city: "",
    agreeToTerms: false,
    agreeToMarketing: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const cities = [
    "תל אביב",
    "ירושלים",
    "חיפה",
    "פתח תקווה",
    "ראשון לציון",
    "באר שבע",
    "נתניה",
    "בני ברק",
    "חולון",
    "רמת גן",
    "אשדוד",
    "אשקלון",
    "הרצליה",
    "כפר סבא",
    "רעננה",
    "מודיעין",
    "אחר",
  ];

  const handleInputChange = (
    field: keyof RegistrationData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic fields validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "שם פרטי הוא שדה חובה";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "שם משפחה הוא שדה חובה";
    }
    if (!formData.email.trim()) {
      newErrors.email = "אימייל הוא שדה חובה";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "אימייל לא תקין";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "מספר טלפון הוא שדה חובה";
    } else if (!/^05\d-?\d{7}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "מספר טלפון לא תקין (05X-XXXXXXX)";
    }
    if (!formData.password) {
      newErrors.password = "סיסמה היא שדה חובה";
    } else if (formData.password.length < 6) {
      newErrors.password = "סיסמה חייבת להכיל לפחות 6 תווים";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "הסיסמאות אינן תואמות";
    }
    if (!formData.city) {
      newErrors.city = "עיר היא שדה חובה";
    }

    // Dealer specific validation
    if (formData.accountType === "dealer" && !formData.businessName.trim()) {
      newErrors.businessName = "שם העסק הוא שדה חובה עבור סוחרים";
    }

    // Terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "יש להסכים לתנאי השימוש";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Save to localStorage (in real app, this would be sent to server)
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        role: formData.accountType,
        businessName: formData.businessName || null,
        city: formData.city,
      };

      localStorage.setItem("auth_token", "new_user_token_" + Date.now());
      localStorage.setItem("user_data", JSON.stringify(userData));

      // Navigate based on account type
      if (formData.accountType === "dealer") {
        router.push("/dealer/home");
      } else {
        router.push("/buyer/home");
      }
    } catch (error) {
      setErrors({ submit: "שגיאה בהרשמה. נסה שוב." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">הרשמה</h2>
          <p className="text-gray-600">צור חשבון חדש ב-Autix</p>
        </div>

        {/* Registration Form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Type Selection */}
              <div>
                <Label className="text-base font-medium text-gray-700 mb-3 block">
                  סוג החשבון
                </Label>
                <div className="space-y-3">
                  <div
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.accountType === "buyer"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleInputChange("accountType", "buyer")}
                  >
                    <input
                      type="radio"
                      name="accountType"
                      checked={formData.accountType === "buyer"}
                      onChange={() => handleInputChange("accountType", "buyer")}
                      className="h-4 w-4 text-blue-600 mr-3"
                    />
                    <User className="w-5 h-5 text-green-600 mr-2" />
                    <div>
                      <div className="font-medium text-gray-900">
                        אני קונה פרטי
                      </div>
                      <div className="text-sm text-gray-500">
                        מחפש לקנות רכב
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.accountType === "dealer"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleInputChange("accountType", "dealer")}
                  >
                    <input
                      type="radio"
                      name="accountType"
                      checked={formData.accountType === "dealer"}
                      onChange={() =>
                        handleInputChange("accountType", "dealer")
                      }
                      className="h-4 w-4 text-blue-600 mr-3"
                    />
                    <Building className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <div className="font-medium text-gray-900">
                        אני סוחר רכב
                      </div>
                      <div className="text-sm text-gray-500">
                        מוכר רכבים למחייתי
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">שם פרטי *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="יוסי"
                    disabled={isLoading}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName">שם משפחה *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="כהן"
                    disabled={isLoading}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Business Name - Only for dealers */}
              {formData.accountType === "dealer" && (
                <div>
                  <Label htmlFor="businessName">שם העסק *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) =>
                      handleInputChange("businessName", e.target.value)
                    }
                    placeholder="רכבי פרימיום"
                    disabled={isLoading}
                  />
                  {errors.businessName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.businessName}
                    </p>
                  )}
                </div>
              )}

              {/* Contact Information */}
              <div>
                <Label htmlFor="email">כתובת אימייל *</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="yossi@example.com"
                    className="pr-10"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">מספר טלפון *</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="050-1234567"
                    className="pr-10"
                    disabled={isLoading}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="city">עיר *</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => handleInputChange("city", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="pr-10">
                      <SelectValue placeholder="בחר עיר" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">סיסמה *</Label>
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
                    placeholder="לפחות 6 תווים"
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
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">אימות סיסמה *</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    placeholder="הזן שוב את הסיסמה"
                    className="pr-10 pl-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked: boolean) =>
                      handleInputChange("agreeToTerms", checked)
                    }
                    disabled={isLoading}
                  />
                  <div className="text-sm">
                    <Label htmlFor="agreeToTerms" className="font-medium">
                      אני מסכים/ה לתנאי השימוש ולמדיניות הפרטיות *
                    </Label>
                    <p className="text-gray-600 mt-1">
                      <Link
                        href="/terms"
                        className="text-blue-600 hover:underline"
                      >
                        תנאי השימוש
                      </Link>{" "}
                      |{" "}
                      <Link
                        href="/privacy"
                        className="text-blue-600 hover:underline"
                      >
                        מדיניות הפרטיות
                      </Link>
                    </p>
                  </div>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>
                )}

                <div className="flex items-start space-x-3 space-x-reverse">
                  <Checkbox
                    id="agreeToMarketing"
                    checked={formData.agreeToMarketing}
                    onCheckedChange={(checked: boolean) =>
                      handleInputChange("agreeToMarketing", checked)
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="agreeToMarketing" className="text-sm">
                    אני מסכים/ה לקבל עדכונים ומבצעים מ-Autix
                  </Label>
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 ml-2" />
                    <p className="text-red-600">{errors.submit}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    נרשם...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 ml-2" />
                    הרשם ל-Autix
                  </>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                כבר יש לך חשבון?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  התחבר כאן
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 ml-1" />
            חזור לדף הבית
          </Link>
        </div>
      </div>
    </div>
  );
}
