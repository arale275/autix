"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowLeft,
  Car,
  Users,
  Building2,
  CheckCircle,
} from "lucide-react";

type UserType = "buyer" | "dealer";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: UserType;
  // Dealer specific
  businessName: string;
  licenseNumber: string;
  address: string;
  city: string;
  description: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading, user } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    userType: "buyer",
    businessName: "",
    licenseNumber: "",
    address: "",
    city: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const dashboardUrl =
        user.userType === "dealer" ? "/dealer/home" : "/buyer/home";
      router.push(dashboardUrl);
    }
  }, [isAuthenticated, isLoading, user, router]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "שם פרטי נדרש";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "שם משפחה נדרש";
    }

    if (!formData.email.trim()) {
      newErrors.email = "אימייל נדרש";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "פורמט אימייל לא תקין";
    }

    if (!formData.password) {
      newErrors.password = "סיסמה נדרשת";
    } else if (formData.password.length < 6) {
      newErrors.password = "סיסמה חייבת להכיל לפחות 6 תווים";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "אישור סיסמה נדרש";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "הסיסמאות לא תואמות";
    }

    if (
      formData.phone &&
      !/^05\d{8}$/.test(formData.phone.replace(/\D/g, ""))
    ) {
      newErrors.phone = "מספר טלפון לא תקין (05X-XXXXXXX)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    if (formData.userType === "buyer") return true;

    const newErrors: Partial<FormData> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "שם עסק נדרש";
    }

    if (!formData.city.trim()) {
      newErrors.city = "עיר נדרשת";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const registerData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        userType: formData.userType,
        // Dealer specific (only if dealer)
        ...(formData.userType === "dealer" && {
          businessName: formData.businessName,
          licenseNumber: formData.licenseNumber || undefined,
          address: formData.address || undefined,
          city: formData.city,
          description: formData.description || undefined,
        }),
      };

      const result = await register(registerData);

      if (result.success) {
        toast.success("נרשמת בהצלחה! ברוך הבא ל-Autix");
        // Redirect will happen in useEffect
      } else {
        toast.error(result.message || "שגיאה ברישום");
      }
    } catch (error) {
      toast.error("אירעה שגיאה ברישום");
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

          <div className="flex items-center justify-center space-x-2 space-x-reverse mb-4">
            <div className="w-10 h-10">
              <img
                src="/autix_logo.png"
                alt="Autix"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Autix</h1>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            הצטרפות ל-Autix
          </h2>
          <p className="text-gray-600">צור חשבון חדש והתחל היום</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-4 space-x-reverse mb-2">
            <div
              className={`flex items-center space-x-2 space-x-reverse ${
                step >= 1 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  step >= 1
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300"
                }`}
              >
                {step > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
              </div>
              <span className="text-sm font-medium">פרטים אישיים</span>
            </div>
            <div
              className={`w-8 h-0.5 ${
                step > 1 ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex items-center space-x-2 space-x-reverse ${
                step >= 2 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  step >= 2
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300"
                }`}
              >
                2
              </div>
              <span className="text-sm font-medium">סוג חשבון</span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {step === 1 ? "פרטים אישיים" : "סוג החשבון שלך"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              /* Step 1: Personal Details */
              <form onSubmit={handleStep1Submit} className="space-y-4">
                {/* Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">שם פרטי *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleChange("firstName", e.target.value)
                      }
                      placeholder="יוסי"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">שם משפחה *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      placeholder="כהן"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="flex items-center space-x-2 space-x-reverse"
                  >
                    <Mail className="w-4 h-4" />
                    <span>אימייל *</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="flex items-center space-x-2 space-x-reverse"
                  >
                    <Phone className="w-4 h-4" />
                    <span>טלפון</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="050-1234567"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="flex items-center space-x-2 space-x-reverse"
                  >
                    <Lock className="w-4 h-4" />
                    <span>סיסמה *</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="לפחות 6 תווים"
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

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">אישור סיסמה *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleChange("confirmPassword", e.target.value)
                      }
                      placeholder="הכנס שוב את הסיסמה"
                    />
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  המשך לשלב הבא
                </Button>
              </form>
            ) : (
              /* Step 2: User Type Selection */
              <form onSubmit={handleStep2Submit} className="space-y-6">
                {/* User Type Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    בחר את סוג החשבון שלך:
                  </Label>

                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange("userType", "buyer")}
                      className={`p-4 border-2 rounded-lg text-right transition-all ${
                        formData.userType === "buyer"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start space-x-3 space-x-reverse">
                        <Users className="w-6 h-6 text-blue-600 mt-0.5" />
                        <div>
                          <h3 className="font-semibold">קונה פרטי</h3>
                          <p className="text-sm text-gray-600">
                            אני מחפש לקנות רכב
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleChange("userType", "dealer")}
                      className={`p-4 border-2 rounded-lg text-right transition-all ${
                        formData.userType === "dealer"
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start space-x-3 space-x-reverse">
                        <Car className="w-6 h-6 text-purple-600 mt-0.5" />
                        <div>
                          <h3 className="font-semibold">סוחר רכב</h3>
                          <p className="text-sm text-gray-600">
                            אני מוכר רכבים ומנהל עסק
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Dealer-specific fields */}
                {formData.userType === "dealer" && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium flex items-center space-x-2 space-x-reverse">
                      <Building2 className="w-4 h-4" />
                      <span>פרטי העסק</span>
                    </h4>

                    <div className="space-y-2">
                      <Label htmlFor="businessName">שם העסק *</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) =>
                          handleChange("businessName", e.target.value)
                        }
                        placeholder="חברת רכב בע״מ"
                      />
                      {errors.businessName && (
                        <p className="text-sm text-red-600">
                          {errors.businessName}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="city">עיר *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleChange("city", e.target.value)}
                          placeholder="תל אביב"
                        />
                        {errors.city && (
                          <p className="text-sm text-red-600">{errors.city}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">מספר רישיון</Label>
                        <Input
                          id="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={(e) =>
                            handleChange("licenseNumber", e.target.value)
                          }
                          placeholder="123456789"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">כתובת העסק</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          handleChange("address", e.target.value)
                        }
                        placeholder="רחוב הרצל 123"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">תיאור העסק</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                        placeholder="ספר על העסק שלך, ההתמחויות והשירותים..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        נרשם...
                      </>
                    ) : (
                      "הצטרף ל-Autix"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    חזור לשלב הקודם
                  </Button>
                </div>
              </form>
            )}

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                יש לך כבר חשבון?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  התחבר כאן
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 הרישום מאובטח ומוצפן. הפרטים שלך מוגנים.
          </p>
        </div>
      </div>
    </div>
  );
}
