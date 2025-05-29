"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Save,
  Edit,
  Building,
} from "lucide-react";

// ממשק פרופיל סוחר
interface DealerProfile {
  id: number;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  businessLicense: string;
  yearsOfExperience: number;
  description: string;
  workingHours: {
    sunday: { open: string; close: string; isOpen: boolean };
    monday: { open: string; close: string; isOpen: boolean };
    tuesday: { open: string; close: string; isOpen: boolean };
    wednesday: { open: string; close: string; isOpen: boolean };
    thursday: { open: string; close: string; isOpen: boolean };
    friday: { open: string; close: string; isOpen: boolean };
    saturday: { open: string; close: string; isOpen: boolean };
  };
  specialties: string[];
  profileImage?: string;
  businessImages: string[];
  joinedAt: string;
}

const DealerProfilePage = () => {
  const [profile, setProfile] = useState<DealerProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<DealerProfile | null>(
    null
  );

  // נתוני דמו
  const sampleProfile: DealerProfile = {
    id: 1,
    businessName: 'רכבי פרימיום בע"מ',
    ownerName: "יוסי כהן",
    phone: "050-1234567",
    email: "yossi@premium-cars.co.il",
    address: "רחוב הרכב 15",
    city: "תל אביב",
    businessLicense: "512345678",
    yearsOfExperience: 12,
    description:
      "סוחר רכב מוסמך עם 12 שנות ניסיון במכירת רכבים איכותיים. מתמחה ברכבי יוקרה ורכבים יפניים אמינים. מספק שירות אישי ומקצועי עם אחריות מלאה על כל רכב.",
    workingHours: {
      sunday: { open: "08:00", close: "18:00", isOpen: true },
      monday: { open: "08:00", close: "18:00", isOpen: true },
      tuesday: { open: "08:00", close: "18:00", isOpen: true },
      wednesday: { open: "08:00", close: "18:00", isOpen: true },
      thursday: { open: "08:00", close: "18:00", isOpen: true },
      friday: { open: "08:00", close: "14:00", isOpen: true },
      saturday: { open: "09:00", close: "13:00", isOpen: false },
    },
    specialties: ["רכבי יוקרה", "רכבים יפניים", "היברידיים", "רכבי משפחה"],
    profileImage: "",
    businessImages: [],
    joinedAt: "2023-03-15",
  };

  useEffect(() => {
    // טעינת פרופיל מ-localStorage או שימוש בדמו
    const savedProfile = localStorage.getItem("dealerProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      setProfile(sampleProfile);
    }
  }, []);

  const handleEditStart = () => {
    setEditedProfile({ ...profile! });
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setEditedProfile(null);
    setIsEditing(false);
  };

  const handleEditSave = () => {
    if (editedProfile) {
      setProfile(editedProfile);
      localStorage.setItem("dealerProfile", JSON.stringify(editedProfile));
      setIsEditing(false);
      setEditedProfile(null);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [field]: value,
      });
    }
  };

  const handleWorkingHoursChange = (day: string, field: string, value: any) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        workingHours: {
          ...editedProfile.workingHours,
          [day]: {
            ...editedProfile.workingHours[
              day as keyof typeof editedProfile.workingHours
            ],
            [field]: value,
          },
        },
      });
    }
  };

  const getDayName = (day: string): string => {
    const dayNames: { [key: string]: string } = {
      sunday: "ראשון",
      monday: "שני",
      tuesday: "שלישי",
      wednesday: "רביעי",
      thursday: "חמישי",
      friday: "שישי",
      saturday: "שבת",
    };
    return dayNames[day] || day;
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        טוען...
      </div>
    );
  }

  const currentProfile = isEditing ? editedProfile! : profile;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building className="h-6 w-6" />
                הפרופיל העסקי שלי
              </h1>
              <p className="text-gray-600 mt-1">
                נרשמת ב-{new Date(profile.joinedAt).toLocaleDateString("he-IL")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!isEditing ? (
                <Button
                  onClick={handleEditStart}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  עריכת פרופיל
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleEditSave}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    שמור שינויים
                  </Button>
                  <Button onClick={handleEditCancel} variant="outline">
                    ביטול
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* תוכן הפרופיל */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* פרטים בסיסיים */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                פרטים בסיסיים
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  שם העסק
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentProfile.businessName}
                    onChange={(e) =>
                      handleInputChange("businessName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="text-gray-900 font-medium">
                    {currentProfile.businessName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  שם הבעלים
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentProfile.ownerName}
                    onChange={(e) =>
                      handleInputChange("ownerName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="text-gray-900">
                    {currentProfile.ownerName}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    טלפון
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={currentProfile.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="text-gray-900 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {currentProfile.phone}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    אימייל
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={currentProfile.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="text-gray-900 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {currentProfile.email}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  כתובת
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentProfile.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="text-gray-900 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    {currentProfile.address}, {currentProfile.city}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    עיר
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentProfile.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="text-gray-900">{currentProfile.city}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    שנות ניסיון
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={currentProfile.yearsOfExperience}
                      onChange={(e) =>
                        handleInputChange(
                          "yearsOfExperience",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="text-gray-900">
                      {currentProfile.yearsOfExperience} שנים
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  מספר רישיון עסק
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentProfile.businessLicense}
                    onChange={(e) =>
                      handleInputChange("businessLicense", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="text-gray-900">
                    {currentProfile.businessLicense}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* תיאור והתמחויות */}
          <Card>
            <CardHeader>
              <CardTitle>תיאור והתמחויות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  תיאור העסק
                </label>
                {isEditing ? (
                  <textarea
                    value={currentProfile.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ספר על העסק שלך, ההתמחויות והשירותים שאתה מציע..."
                  />
                ) : (
                  <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {currentProfile.description}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  התמחויות
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.specialties.map((specialty, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="mt-2 text-sm text-gray-500">
                    * עריכת התמחויות תתאפשר בגרסה עתידית
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* שעות פעילות */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                שעות פעילות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(currentProfile.workingHours).map(
                  ([day, hours]) => (
                    <div key={day} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{getDayName(day)}</span>
                        {isEditing ? (
                          <input
                            type="checkbox"
                            checked={hours.isOpen}
                            onChange={(e) =>
                              handleWorkingHoursChange(
                                day,
                                "isOpen",
                                e.target.checked
                              )
                            }
                            className="rounded"
                          />
                        ) : (
                          <Badge
                            variant={hours.isOpen ? "default" : "secondary"}
                          >
                            {hours.isOpen ? "פתוח" : "סגור"}
                          </Badge>
                        )}
                      </div>

                      {hours.isOpen && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <span>פתיחה:</span>
                            {isEditing ? (
                              <input
                                type="time"
                                value={hours.open}
                                onChange={(e) =>
                                  handleWorkingHoursChange(
                                    day,
                                    "open",
                                    e.target.value
                                  )
                                }
                                className="border rounded px-2 py-1"
                              />
                            ) : (
                              <span className="font-medium">{hours.open}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span>סגירה:</span>
                            {isEditing ? (
                              <input
                                type="time"
                                value={hours.close}
                                onChange={(e) =>
                                  handleWorkingHoursChange(
                                    day,
                                    "close",
                                    e.target.value
                                  )
                                }
                                className="border rounded px-2 py-1"
                              />
                            ) : (
                              <span className="font-medium">{hours.close}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DealerProfilePage;
