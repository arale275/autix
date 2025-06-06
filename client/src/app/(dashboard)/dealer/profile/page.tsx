"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Settings,
  Calendar,
  Shield,
  Download,
  Trash2,
  AlertTriangle,
  Edit,
  User,
  Lock,
  Camera,
  Save,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  HeadphonesIcon,
  FileText,
  Globe,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import LoadingState from "@/components/states/LoadingState";
import ErrorState from "@/components/states/ErrorState";
import ProfileForm from "@/components/forms/ProfileForm";
import { useAuth } from "@/contexts/AuthContext";
import { useDealerRoute } from "@/hooks/auth/useProtectedRoute";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ✅ Simple profile completion calculation
const calculateProfileCompletion = (user: any): number => {
  if (!user) return 0;
  const fields = [user.firstName, user.lastName, user.email, user.phone];
  const completedFields = fields.filter(
    (field) => field && field.trim() !== ""
  ).length;
  return Math.round((completedFields / fields.length) * 100);
};

// ✅ Simple member duration calculation
const getMemberDuration = (createdAt: string): string => {
  if (!createdAt) return "לא ידוע";
  const created = new Date(createdAt);
  const now = new Date();
  const months =
    (now.getFullYear() - created.getFullYear()) * 12 +
    now.getMonth() -
    created.getMonth();

  if (months < 1) return "חדש";
  if (months < 12) return `${months} חודשים`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return `${years} ${years === 1 ? "שנה" : "שנים"}${
    remainingMonths > 0 ? ` ו-${remainingMonths} חודשים` : ""
  }`;
};

// ✅ Profile info card component
const ProfileInfoCard = ({ user }: { user: any }) => {
  const profileCompletion = calculateProfileCompletion(user);
  const memberSince = getMemberDuration(user.createdAt);

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          {/* Profile Avatar */}
          <div className="relative">
            <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center">
              <Building2 className="w-10 h-10 text-purple-600" />
            </div>
            <Button
              size="sm"
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full p-0"
              onClick={() => toast.info("עדכון תמונה - בקרוב")}
            >
              <Camera className="w-3 h-3" />
            </Button>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                <Building2 className="w-3 h-3 mr-1" />
                סוחר מורשה
              </Badge>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                חבר מאז {memberSince}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                ID: {user.id.toString().padStart(6, "0")}
              </span>
            </div>

            {/* Profile Completion */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">השלמת פרופיל</span>
                <span className="font-medium">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2" />
              {profileCompletion < 100 && (
                <p className="text-xs text-gray-500 mt-1">
                  השלם את הפרטים החסרים לשיפור החשיפה
                </p>
              )}
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4 text-gray-500" />
                {user.email}
              </span>
              {user.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4 text-gray-500" />
                  {user.phone}
                </span>
              )}
            </div>
          </div>

          {/* Quick Action */}
          <div className="hidden md:block">
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              ערוך פרופיל
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ✅ Main component
export default function DealerProfilePage() {
  const router = useRouter();
  const { hasAccess, isLoading: authLoading } = useDealerRoute();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [showDangerZone, setShowDangerZone] = useState(false);

  // ✅ Simple actions
  const handleExportData = () => {
    const data = { user, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `autix-profile-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("נתונים יוצאו בהצלחה");
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "האם אתה בטוח שברצונך למחוק את החשבון? פעולה זו לא ניתנת לביטול!"
      )
    ) {
      if (window.confirm("האם אתה באמת בטוח? כל הנתונים יימחקו לצמיתות!")) {
        toast.error("מחיקת חשבון - פונקציה זו תמומש בקרוב");
      }
    }
  };

  // Auth checks
  if (authLoading) {
    return <LoadingState message="טוען הרשאות..." />;
  }

  if (!hasAccess || !user) {
    return (
      <ErrorState title="גישה נדחתה" message="אנא התחבר כדי לצפות בפרופיל" />
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* ✅ Simple Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">הפרופיל שלי</h1>
          <p className="text-gray-600 mt-1">
            נהל את הפרטים האישיים והעדפות החשבון שלך
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          הגדרות
        </Button>
      </div>

      {/* ✅ Profile Info */}
      <ProfileInfoCard user={user} />

      {/* ✅ Simple Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">עריכת פרופיל</TabsTrigger>
          <TabsTrigger value="settings">הגדרות חשבון</TabsTrigger>
        </TabsList>

        {/* ✅ Profile Edit Tab */}
        <TabsContent value="profile">
          <ProfileForm
            onSuccess={() => {
              toast.success("הפרופיל עודכן בהצלחה");
            }}
          />
        </TabsContent>

        {/* ✅ Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                הגדרות חשבון
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">הודעות אימייל</h4>
                  <p className="text-sm text-gray-600">
                    קבל עדכונים על פניות ורכבים חדשים
                  </p>
                </div>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">התראות דחיפה</h4>
                  <p className="text-sm text-gray-600">
                    התראות מיידיות על פניות חדשות
                  </p>
                </div>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">פרופיל ציבורי</h4>
                  <p className="text-sm text-gray-600">
                    הצג את העסק בתוצאות החיפוש
                  </p>
                </div>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                פרטיות ואבטחה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={handleExportData}
                >
                  <Download className="w-4 h-4 mr-2" />
                  הורד את נתוני החשבון
                </Button>

                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => toast.info("שינוי סיסמה - בקרוב")}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  שנה סיסמה
                </Button>

                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => toast.info("היסטוריית גישה - בקרוב")}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  היסטוריית גישה
                </Button>

                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => toast.info("גיבוי נתונים - בקרוב")}
                >
                  <Save className="w-4 h-4 mr-2" />
                  גיבוי נתונים
                </Button>
              </div>

              {/* Danger Zone */}
              <div className="border-t pt-4">
                <Button
                  variant="outline"
                  className="w-full justify-start text-yellow-600 hover:text-yellow-700"
                  onClick={() => setShowDangerZone(!showDangerZone)}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  אזור סכנה
                </Button>

                {showDangerZone && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">
                      פעולות בלתי הפיכות
                    </h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportData}
                        className="w-full justify-start"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        גיבוי מלא של נתוני החשבון
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteAccount}
                        className="w-full justify-start text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        מחק חשבון לצמיתות
                      </Button>
                    </div>

                    <div className="mt-3 text-xs text-red-600">
                      <p>
                        ⚠️ מחיקת החשבון תסיר את כל הרכבים, הפניות וההיסטוריה
                        לצמיתות
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeadphonesIcon className="w-5 h-5" />
                תמיכה ועזרה
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  מדריך משתמש
                </Button>

                <Button variant="outline" className="justify-start">
                  <Globe className="w-4 h-4 mr-2" />
                  מרכז עזרה
                </Button>

                <Button variant="outline" className="justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  צור קשר עם תמיכה
                </Button>

                <Button variant="outline" className="justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  צ'אט עם תמיכה
                </Button>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>טיפ:</strong> רוב השאלות נענות במדריך המשתמש.
                  לבעיות דחופות, צור קשר עם התמיכה.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
