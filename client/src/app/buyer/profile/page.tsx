"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";

// ממשק משתמש
interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinedAt: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
  };
  stats: {
    totalRequests: number;
    totalInquiries: number;
    savedCars: number;
    activeRequests: number;
  };
}

// נתוני דמו של הקונה
const sampleProfile: UserProfile = {
  id: 1,
  name: "אליה כהן",
  email: "eliya.cohen@example.com",
  phone: "052-9876543",
  location: "תל אביב",
  joinedAt: "2024-01-15",
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
  },
  stats: {
    totalRequests: 3,
    totalInquiries: 8,
    savedCars: 5,
    activeRequests: 2,
  },
};

const locations = [
  "תל אביב",
  "ירושלים",
  "חיפה",
  "באר שבע",
  "נתניה",
  "פתח תקווה",
  "אשדוד",
  "ראשון לציון",
  "אשקלון",
  "רחובות",
  "בת ים",
  "הרצליה",
  "רמת גן",
  "בני ברק",
  "חולון",
  "רמלה",
  "לוד",
  "נס ציונה",
];

const BuyerProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile>(sampleProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = () => {
    const updatedProfile = {
      ...profile,
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      location: editForm.location,
    };

    setProfile(updatedProfile);
    // כאן ישלח לשרת
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
    });
    setIsEditing(false);
  };

  const handlePreferenceChange = (
    key: keyof typeof profile.preferences,
    value: boolean
  ) => {
    const updatedProfile = {
      ...profile,
      preferences: {
        ...profile.preferences,
        [key]: value,
      },
    };
    setProfile(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("הסיסמאות לא תואמות");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    // כאן ישלח לשרת
    alert("הסיסמה שונתה בהצלחה");
    setShowChangePassword(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleDeleteAccount = () => {
    // כאן ישלח בקשה לשרת למחיקת החשבון
    alert("החשבון נמחק בהצלחה");
    setShowDeleteModal(false);
    // הפניה לדף הבית או התחברות
  };

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    localStorage.removeItem("userRequests");
    localStorage.removeItem("userInquiries");
    localStorage.removeItem("savedCars");
    alert("התנתקת בהצלחה");
    // הפניה לדף התחברות
  };

  const getJoinedTime = () => {
    const joinDate = new Date(profile.joinedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));

    if (diffMonths < 1) return "פחות מחודש";
    if (diffMonths === 1) return "חודש";
    return `${diffMonths} חודשים`;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
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
                        <Label className="text-sm text-gray-600">שם מלא</Label>
                        <div className="font-medium text-gray-900 mt-1">
                          {profile.name}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">מייל</Label>
                        <div className="font-medium text-gray-900 mt-1">
                          {profile.email}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">טלפון</Label>
                        <div className="font-medium text-gray-900 mt-1">
                          {profile.phone}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">מיקום</Label>
                        <div className="font-medium text-gray-900 mt-1">
                          {profile.location}
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
                        <Label htmlFor="name">שם מלא *</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
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
                        <Label htmlFor="phone">טלפון *</Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm({ ...editForm, phone: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="location">מיקום *</Label>
                        <Select
                          value={editForm.location}
                          onValueChange={(value) =>
                            setEditForm({ ...editForm, location: value })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        שמור שינויים
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
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
                      profile.preferences.emailNotifications
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      handlePreferenceChange(
                        "emailNotifications",
                        !profile.preferences.emailNotifications
                      )
                    }
                  >
                    {profile.preferences.emailNotifications ? "פעיל" : "כבוי"}
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
                      profile.preferences.smsNotifications
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      handlePreferenceChange(
                        "smsNotifications",
                        !profile.preferences.smsNotifications
                      )
                    }
                  >
                    {profile.preferences.smsNotifications ? "פעיל" : "כבוי"}
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
                      profile.preferences.marketingEmails
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      handlePreferenceChange(
                        "marketingEmails",
                        !profile.preferences.marketingEmails
                      )
                    }
                  >
                    {profile.preferences.marketingEmails ? "פעיל" : "כבוי"}
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
                  <Badge variant="outline">{profile.stats.totalRequests}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">פניות ששלחתי</span>
                  </div>
                  <Badge variant="outline">
                    {profile.stats.totalInquiries}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-green-600" />
                    <span className="text-sm">מודעות ששמרתי</span>
                  </div>
                  <Badge variant="outline">{profile.stats.savedCars}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">בקשות פעילות</span>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">
                    {profile.stats.activeRequests}
                  </Badge>
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
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 ml-2" />
                    צור קשר עם התמיכה
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertCircle className="h-4 w-4 ml-2" />
                    מרכז עזרה
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
