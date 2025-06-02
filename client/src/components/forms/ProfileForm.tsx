"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useProfile, usePasswordForm } from "@/hooks/api/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { User, UpdateProfileRequest } from "@/lib/api/types";
import { toast } from "sonner";
import {
  User as UserIcon,
  Building2,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Save,
  Shield,
} from "lucide-react";

interface ProfileFormProps {
  onSuccess?: () => void;
  className?: string;
}

export default function ProfileForm({
  onSuccess,
  className = "",
}: ProfileFormProps) {
  const { user } = useAuth();
  const { profile, updating, updateProfile, changePassword } = useProfile();
  const {
    formData: passwordData,
    errors: passwordErrors,
    showPasswords,
    updateField: updatePasswordField,
    togglePasswordVisibility,
    validateForm: validatePasswordForm,
    resetForm: resetPasswordForm,
    getPasswordData,
  } = usePasswordForm();

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    address: "",
    city: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<UpdateProfileRequest>>({});
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize form data from user profile
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        // These would come from joined dealer/buyer data
        businessName: "",
        address: "",
        city: "",
        description: "",
      });
    }
  }, [profile]);

  const handleChange = (field: keyof UpdateProfileRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UpdateProfileRequest> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "שם פרטי נדרש";
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = "שם משפחה נדרש";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "אימייל נדרש";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "פורמט אימייל לא תקין";
    }

    if (
      formData.phone &&
      !/^05\d{8}$/.test(formData.phone.replace(/\D/g, ""))
    ) {
      newErrors.phone = "מספר טלפון לא תקין (05X-XXXXXXX)";
    }

    // Dealer specific validation
    if (user?.userType === "dealer" && !formData.businessName?.trim()) {
      newErrors.businessName = "שם עסק נדרש";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("אנא תקן את השגיאות בטופס");
      return;
    }

    // Remove undefined/empty values
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(
        ([_, value]) => value && value.trim() !== ""
      )
    );

    const success = await updateProfile(cleanData);
    if (success) {
      toast.success("הפרופיל עודכן בהצלחה");
      setIsDirty(false);
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      toast.error("אנא תקן את השגיאות בשינוי הסיסמה");
      return;
    }

    const success = await changePassword(getPasswordData());
    if (success) {
      toast.success("הסיסמה שונתה בהצלחה");
      resetPasswordForm();
      setShowPasswordSection(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            פרטים אישיים
            <Badge
              variant={user?.userType === "dealer" ? "secondary" : "default"}
            >
              {user?.userType === "dealer" ? "סוחר" : "קונה"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">שם פרטי *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
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
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  אימייל *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  טלפון
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
            </div>

            {/* Dealer Specific Fields */}
            {user?.userType === "dealer" && (
              <>
                <div className="border-t my-6"></div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    פרטי עסק
                  </h3>

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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        עיר
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        placeholder="תל אביב"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">כתובת</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          handleChange("address", e.target.value)
                        }
                        placeholder="רחוב הרצל 123"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">תיאור העסק</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      placeholder="ספר על העסק שלך, התמחויות, שירותים..."
                      rows={3}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={updating || !isDirty}
                className="min-w-[120px]"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    שומר...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    שמור שינויים
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Change Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              שינוי סיסמה
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
            >
              {showPasswordSection ? "ביטול" : "שנה סיסמה"}
            </Button>
          </div>
        </CardHeader>

        {showPasswordSection && (
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">סיסמה נוכחית *</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      updatePasswordField("currentPassword", e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-red-600">
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">סיסמה חדשה *</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        updatePasswordField("newPassword", e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                      onClick={() => togglePasswordVisibility("new")}
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-600">
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">אישור סיסמה *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        updatePasswordField("confirmPassword", e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                      onClick={() => togglePasswordVisibility("confirm")}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">דרישות סיסמה:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>לפחות 6 תווים</li>
                      <li>מומלץ לכלול אותיות גדולות וקטנות</li>
                      <li>מומלץ לכלול מספרים</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={updating}
                  className="min-w-[120px]"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      משנה...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      שנה סיסמה
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
