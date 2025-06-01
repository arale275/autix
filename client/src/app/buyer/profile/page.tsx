"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Settings,
  Trash2,
  LogOut,
  Shield,
  Bell,
  MessageSquare,
  Car,
  Search,
  Loader2,
  ArrowLeft,
} from "lucide-react";

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.autix.co.il";

// Types
interface UserStats {
  totalRequests: number;
  activeRequests: number;
  totalInquiries: number;
  savedCars: number;
}

interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
}

const BuyerProfilePage = () => {
  const router = useRouter();

  // ✅ השתמש רק ב-useAuth
  const { user, isAuthenticated, isLoading } = useAuth();

  // ✅ State לבדיקת client-side
  const [isClient, setIsClient] = useState(false);

  const [stats, setStats] = useState<UserStats>({
    totalRequests: 0,
    activeRequests: 0,
    totalInquiries: 0,
    savedCars: 0,
  });
  const [preferences, setPreferences] = useState<UserPreferences>({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // ✅ בדיקת client-side - מונע SSR issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ Helper functions מוגנות מ-SSR
  const getLocalStorageItem = (
    key: string,
    defaultValue: string = ""
  ): string => {
    if (!isClient) return defaultValue;
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const setLocalStorageItem = (key: string, value: string): void => {
    if (!isClient) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("Error setting localStorage:", error);
    }
  };

  const removeLocalStorageItem = (key: string): void => {
    if (!isClient) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing localStorage:", error);
    }
  };

  // ✅ Debug console logs - רק בצד הלקוח
  useEffect(() => {
    if (!isClient) return;

    console.log("🔍 BuyerProfilePage Debug:", {
      isAuthenticated,
      isLoading,
      user: user ? `${user.firstName} ${user.lastName}` : null,
      userType: user?.userType,
      localStorage_token: getLocalStorageItem("auth_token")
        ? "exists"
        : "missing",
    });
  }, [isClient, isAuthenticated, isLoading, user]);

  // ✅ בדיקת authentication נכונה
  useEffect(() => {
    if (!isClient) return;

    console.log("🔍 Auth check:", { isLoading, isAuthenticated });

    // חכה שהאימות יסתיים
    if (isLoading) return;

    // אם לא מחובר - הפנה להתחברות
    if (!isAuthenticated) {
      console.log("❌ Not authenticated, redirecting to login");
      router.push("/auth/login");
      return;
    }

    // בדיקת סוג משתמש
    if (user?.userType !== "buyer") {
      console.log("❌ Not a buyer, redirecting");
      router.push("/dealer/home");
      return;
    }

    console.log("✅ Authentication OK, loading data");
  }, [isClient, isLoading, isAuthenticated, user, router]);

  // ✅ טעינת נתונים - רק אחרי אימות מוצלח
  useEffect(() => {
    if (!isClient || isLoading || !isAuthenticated || !user) {
      return; // עדיין ממתין או לא מחובר
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ השתמש ב-auth_token (עקבי!)
        const token = getLocalStorageItem("auth_token");

        if (!token) {
          console.log("❌ No auth_token found");
          router.push("/auth/login");
          return;
        }

        console.log(
          "🔄 Loading profile data with token:",
          token.substring(0, 20) + "..."
        );

        // Set initial form data from AuthContext user
        setEditForm({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
        });

        // Load fresh profile data from API (optional - for most recent data)
        try {
          const response = await fetch(`${API_URL}/api/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log("👤 Fresh profile data:", data);
            if (data.success) {
              // Update form with fresh data if available
              setEditForm({
                firstName: data.data.firstName || "",
                lastName: data.data.lastName || "",
                email: data.data.email || "",
                phone: data.data.phone || "",
              });
            }
          } else {
            console.warn("❌ Profile API failed:", response.status);
          }
        } catch (apiError) {
          console.error("Error fetching fresh profile:", apiError);
        }

        // Load statistics
        await loadStats(token);

        // Load preferences from localStorage
        const savedPreferences = getLocalStorageItem("userPreferences");
        if (savedPreferences) {
          try {
            setPreferences(JSON.parse(savedPreferences));
          } catch {
            console.warn("Error parsing user preferences");
          }
        }

        console.log("✅ Profile data loaded successfully");
      } catch (error) {
        console.error("❌ Error loading profile data:", error);
        setError(
          error instanceof Error ? error.message : "שגיאה בטעינת הנתונים"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isClient, isLoading, isAuthenticated, user, router]);

  const loadStats = async (token: string) => {
    try {
      // Load stats from various APIs
      const [requestsResponse, inquiriesResponse] = await Promise.all([
        fetch(`${API_URL}/api/car-requests/my-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/inquiries/sent`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      let totalRequests = 0;
      let activeRequests = 0;
      let totalInquiries = 0;

      // Process requests
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        if (requestsData.success) {
          const requests = requestsData.data.requests || [];
          totalRequests = requests.length;
          activeRequests = requests.filter(
            (r: any) => r.status === "active"
          ).length;
        }
      }

      // Process inquiries
      if (inquiriesResponse.ok) {
        const inquiriesData = await inquiriesResponse.json();
        if (inquiriesData.success) {
          totalInquiries = inquiriesData.data.inquiries?.length || 0;
        }
      }

      // Get saved cars from localStorage
      const savedCarsData = getLocalStorageItem("savedCars", "[]");
      let savedCars = [];
      try {
        savedCars = JSON.parse(savedCarsData);
      } catch {
        savedCars = [];
      }

      setStats({
        totalRequests,
        activeRequests,
        totalInquiries,
        savedCars: savedCars.length,
      });

      console.log("📊 Stats loaded:", {
        totalRequests,
        activeRequests,
        totalInquiries,
        savedCars: savedCars.length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !isClient) return;

    try {
      setSaving(true);
      const token = getLocalStorageItem("auth_token");

      if (!token) {
        setError("לא נמצא token - אנא התחבר מחדש");
        router.push("/auth/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          email: editForm.email,
          phone: editForm.phone,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update localStorage user data
        const updatedUserData = {
          ...user,
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          email: editForm.email,
          phone: editForm.phone,
        };

        setLocalStorageItem("user_data", JSON.stringify(updatedUserData));

        setIsEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);

        console.log("✅ Profile updated successfully");
      } else {
        throw new Error(data.message || "שגיאה לא ידועה");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      const errorMessage =
        error instanceof Error ? error.message : "שגיאה בשמירת הפרטים";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
    setIsEditing(false);
  };

  const handlePreferenceChange = (
    key: keyof UserPreferences,
    value: boolean
  ) => {
    const updatedPreferences = {
      ...preferences,
      [key]: value,
    };
    setPreferences(updatedPreferences);
    setLocalStorageItem("userPreferences", JSON.stringify(updatedPreferences));
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("הסיסמאות לא תואמות");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    try {
      const token = getLocalStorageItem("auth_token");

      if (!token) {
        setError("לא נמצא token - אנא התחבר מחדש");
        router.push("/auth/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("הסיסמה שונתה בהצלחה");
        setShowChangePassword(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert("שגיאה בשינוי הסיסמה: " + (data.message || "שגיאה לא ידועה"));
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("שגיאה בשינוי הסיסמה");
    }
  };

  const handleDeleteAccount = async () => {
    if (!isClient) return;

    try {
      const token = getLocalStorageItem("auth_token");

      if (!token) {
        alert("שגיאת אימות");
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/delete-account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Clear all local data
        removeLocalStorageItem("user_data");
        removeLocalStorageItem("auth_token");
        removeLocalStorageItem("userPreferences");
        removeLocalStorageItem("savedCars");

        alert("החשבון נמחק בהצלחה");
        router.push("/");
      } else {
        alert("שגיאה במחיקת החשבון");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("שגיאה במחיקת החשבון");
    }

    setShowDeleteModal(false);
  };

  const handleLogout = () => {
    if (!isClient) return;

    removeLocalStorageItem("user_data");
    removeLocalStorageItem("auth_token");
    removeLocalStorageItem("userPreferences");

    // Trigger auth change event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-changed"));
    }

    router.push("/auth/login");
  };

  const getJoinedTime = () => {
    if (!user?.createdAt) return "לא ידוע";

    const joinDate = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));

    if (diffMonths < 1) return "פחות מחודש";
    if (diffMonths === 1) return "חודש";
    return `${diffMonths} חודשים`;
  };

  // ✅ SSR Safe - לא מרנדר עד שהclient מוכן
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  // ✅ Loading state מסודר
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">בודק אימות...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">שגיאה</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>נסה שוב</Button>
        </div>
      </div>
    );
  }

  // ✅ רק אחרי שהאימות הסתיים
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            נדרשת התחברות
          </h1>
          <p className="text-gray-600 mb-4">
            אנא התחבר כדי לראות את הפרופיל שלך
          </p>
          <Button onClick={() => router.push("/auth/login")}>התחבר</Button>
        </div>
      </div>
    );
  }

  // ✅ Loading של נתונים (אחרי אימות מוצלח)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">טוען פרטי פרופיל...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => router.push("/buyer/home")}
            >
              <ArrowLeft className="h-4 w-4" />
              חזרה לדף הבית
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <User className="h-6 w-6" />
                הפרופיל שלי
              </h1>
              <p className="text-gray-600 mt-1">
                ניהול הפרטים האישיים והעדפות החשבון
              </p>
            </div>

            {saved && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                הפרטים נשמרו בהצלחה
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* עמודה ראשית */}
          <div className="lg:col-span-2 space-y-6">
            {/* פרטים אישיים */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    פרטים אישיים
                  </CardTitle>

                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      ערוך
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditing ? (
                  // תצוגת קריאה
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">שם פרטי</Label>
                        <div className="font-medium text-gray-900 mt-1">
                          {user.firstName || "לא צוין"}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">
                          שם משפחה
                        </Label>
                        <div className="font-medium text-gray-900 mt-1">
                          {user.lastName || "לא צוין"}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">מייל</Label>
                        <div className="font-medium text-gray-900 mt-1">
                          {user.email}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">טלפון</Label>
                        <div className="font-medium text-gray-900 mt-1">
                          {user.phone || "לא צוין"}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        חבר ב-Autix כבר {getJoinedTime()}
                      </div>
                    </div>
                  </div>
                ) : (
                  // תצוגת עריכה
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">שם פרטי *</Label>
                        <Input
                          id="firstName"
                          value={editForm.firstName}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              firstName: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="lastName">שם משפחה *</Label>
                        <Input
                          id="lastName"
                          value={editForm.lastName}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              lastName: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">מייל *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">טלפון</Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm({ ...editForm, phone: e.target.value })
                          }
                          className="mt-1"
                          placeholder="050-1234567"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {saving ? "שומר..." : "שמור שינויים"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={saving}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        ביטול
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* העדפות התראות */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  העדפות התראות
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">התראות מייל</div>
                    <div className="text-sm text-gray-600">
                      קבל התראות על פניות חדשות ועדכונים
                    </div>
                  </div>
                  <Button
                    variant={
                      preferences.emailNotifications ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      handlePreferenceChange(
                        "emailNotifications",
                        !preferences.emailNotifications
                      )
                    }
                  >
                    {preferences.emailNotifications ? "פעיל" : "כבוי"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">התראות SMS</div>
                    <div className="text-sm text-gray-600">
                      קבל הודעות טקסט על פעילות חשובה
                    </div>
                  </div>
                  <Button
                    variant={
                      preferences.smsNotifications ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      handlePreferenceChange(
                        "smsNotifications",
                        !preferences.smsNotifications
                      )
                    }
                  >
                    {preferences.smsNotifications ? "פעיל" : "כבוי"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">מיילים שיווקיים</div>
                    <div className="text-sm text-gray-600">
                      קבל טיפים ומבצעים מיוחדים
                    </div>
                  </div>
                  <Button
                    variant={
                      preferences.marketingEmails ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      handlePreferenceChange(
                        "marketingEmails",
                        !preferences.marketingEmails
                      )
                    }
                  >
                    {preferences.marketingEmails ? "פעיל" : "כבוי"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* אבטחת החשבון */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  אבטחת החשבון
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showChangePassword ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">סיסמה</div>
                      <div className="text-sm text-gray-600">
                        עדכן את הסיסמה שלך מעת לעת
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowChangePassword(true)}
                    >
                      שנה סיסמה
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="currentPassword">סיסמה נוכחית</Label>
                      <div className="relative mt-1">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              currentPassword: e.target.value,
                            })
                          }
                          className="pl-10"
                        />
                        <button
                          type="button"
                          className="absolute left-3 top-1/2 transform -translate-y-1/2"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="newPassword">סיסמה חדשה</Label>
                      <div className="relative mt-1">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              newPassword: e.target.value,
                            })
                          }
                          className="pl-10"
                        />
                        <button
                          type="button"
                          className="absolute left-3 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">אישור סיסמה חדשה</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleChangePassword}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={
                          !passwordForm.currentPassword ||
                          !passwordForm.newPassword ||
                          !passwordForm.confirmPassword
                        }
                      >
                        שמור סיסמה חדשה
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowChangePassword(false);
                          setPasswordForm({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                      >
                        ביטול
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* פעולות חשבון */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  פעולות חשבון
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">התנתקות</div>
                    <div className="text-sm text-gray-600">
                      התנתק מהחשבון בכל המכשירים
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    התנתק
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-red-600">מחיקת חשבון</div>
                    <div className="text-sm text-gray-600">
                      מחק את החשבון שלך לצמיתות
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    מחק חשבון
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* סייד-בר */}
          <div className="space-y-6">
            {/* סטטיסטיקות */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">הפעילות שלי</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">בקשות ששלחתי</span>
                  </div>
                  <Badge variant="outline">{stats.totalRequests}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">פניות ששלחתי</span>
                  </div>
                  <Badge variant="outline">{stats.totalInquiries}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-green-600" />
                    <span className="text-sm">מודעות ששמרתי</span>
                  </div>
                  <Badge variant="outline">{stats.savedCars}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">בקשות פעילות</span>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">
                    {stats.activeRequests}
                  </Badge>
                </div>

                <div className="pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => router.push("/buyer/requests")}
                  >
                    צפה בפעילות המלאה
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* מידע נוסף */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">מידע שימושי</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <span>עדכן את הפרטים שלך כדי לקבל הצעות מדויקות יותר</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <span>בחר באילו התראות אתה מעוניין לקבל</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <span>שנה סיסמה מעת לעת לאבטחה מיטבית</span>
                </div>
              </CardContent>
            </Card>

            {/* תמיכה */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">זקוק לעזרה?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push("/info/contact")}
                  >
                    <MessageSquare className="h-4 w-4 ml-2" />
                    צור קשר עם התמיכה
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push("/info/about")}
                  >
                    <AlertCircle className="h-4 w-4 ml-2" />
                    מידע על AUTIX
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal מחיקת חשבון */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                מחיקת חשבון
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                האם אתה בטוח שברצונך למחוק את החשבון שלך?
              </p>

              <div className="bg-red-50 p-3 rounded-lg text-sm text-red-700">
                <strong>שים לב:</strong> פעולה זו אינה ניתנת לביטול. כל הנתונים
                שלך יימחקו לצמיתות, כולל:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>כל הבקשות והפניות</li>
                  <li>המודעות השמורות</li>
                  <li>פרטי הפרופיל</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  כן, מחק את החשבון
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                >
                  ביטול
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BuyerProfilePage;
