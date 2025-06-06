"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Settings,
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

// ✅ Profile info card component
const ProfileInfoCard = ({ user }: { user: any }) => {
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {user.firstName} {user.lastName}
            </h2>

            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{user.phone || "לא צוין"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{user.email || "לא צוין"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span>{user.businessName || "לא צוין"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{user.address || "לא צוין"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{user.city || "לא צוין"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span>{user.description || "לא צוין"}</span>
              </div>
            </div>
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
      {/* ✅ Updated Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">הפרופיל שלי</h1>
          <p className="text-gray-600 mt-1">
            נהל את הפרטים האישיים והעדפות החשבון שלך
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("profile")}
          >
            <Edit className="w-4 h-4 mr-2" />
            עריכת פרופיל
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="w-4 h-4 mr-2" />
            הגדרות חשבון
          </Button>
        </div>
      </div>

      {/* ✅ Updated Profile Info */}
      <ProfileInfoCard user={user} />

      {/* ✅ Content based on active tab */}
      <div className="space-y-6">
        {activeTab === "profile" && (
          <ProfileForm
            onSuccess={() => {
              toast.success("הפרופיל עודכן בהצלחה");
            }}
          />
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Privacy & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  פרטיות ואבטחה
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={handleExportData}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    הורד את נתוני החשבון
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
          </div>
        )}
      </div>
    </div>
  );
}
