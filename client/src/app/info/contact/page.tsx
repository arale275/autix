"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  CheckCircle,
  Send,
  Loader2,
  AlertCircle,
  Users,
  Car,
  Shield,
  Headphones,
} from "lucide-react";

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    userType: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Replace with actual API call
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // });

    // סימולציית שליחת טופס
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      userType: "",
    });
    setIsSubmitted(false);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "אימייל",
      value: "support@autix.co.il",
      description: "זמן תגובה: עד 24 שעות",
      color: "text-blue-600",
    },
    {
      icon: Phone,
      title: "טלפון",
      value: "03-1234567",
      description: "א׳-ה׳ 9:00-18:00",
      color: "text-green-600",
    },
    {
      icon: MessageSquare,
      title: "צ׳אט",
      value: "צ׳אט חי באתר",
      description: "זמין 24/7",
      color: "text-purple-600",
    },
    {
      icon: MapPin,
      title: "כתובת",
      value: "תל אביב, ישראל",
      description: "פגישות לפי תיאום מראש",
      color: "text-orange-600",
    },
  ];

  const helpTopics = [
    {
      icon: Car,
      title: "עזרה בחיפוש רכב",
      description: "צוות המומחים שלנו יעזור לך למצוא את הרכב המושלם",
    },
    {
      icon: Users,
      title: "הצטרפות כסוחר",
      description: "רוצה להצטרף לרשת הסוחרים שלנו? נשמח לשמוע",
    },
    {
      icon: Shield,
      title: "בעיות אבטחה",
      description: "דיווח על בעיות אבטחה או חשדות להונאה",
    },
    {
      icon: Headphones,
      title: "תמיכה טכנית",
      description: "בעיות באתר או באפליקציה? נפתור לך מיד",
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              חזרה
            </Button>
          </div>

          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md text-center shadow-lg">
              <CardContent className="p-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  ההודעה נשלחה בהצלחה!
                </h1>

                <p className="text-gray-600 mb-8">
                  תודה על פנייתך אלינו. אנחנו נחזור אליך תוך 24 שעות.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-2 text-blue-800 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">
                      מספר פנייה: #{Math.floor(Math.random() * 10000)}
                    </span>
                  </div>
                  <div className="text-blue-700 text-sm mt-1">
                    שמור את המספר הזה לעתיד
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={resetForm}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    שלח הודעה נוספת
                  </Button>
                  <Button onClick={() => router.push("/")} variant="outline">
                    חזרה לדף הבית
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            חזרה
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            צור קשר עם AUTIX
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            יש לך שאלה? זקוק לעזרה? או רוצה להצטרף אלינו? אנחנו כאן בשבילך 24/7
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  שלח לנו הודעה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* User Type */}
                  <div>
                    <Label htmlFor="userType">אני...</Label>
                    <Select
                      value={formData.userType}
                      onValueChange={(value) =>
                        handleInputChange("userType", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="בחר סוג משתמש" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">קונה מחפש רכב</SelectItem>
                        <SelectItem value="dealer">סוחר רכב</SelectItem>
                        <SelectItem value="partner">
                          שותף עסקי פוטנציאלי
                        </SelectItem>
                        <SelectItem value="investor">משקיע</SelectItem>
                        <SelectItem value="other">אחר</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">שם מלא *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="שם פרטי ומשפחה"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">אימייל *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="your@email.com"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Phone & Subject */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">טלפון</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="050-1234567"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">נושא הפנייה *</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) =>
                          handleInputChange("subject", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="בחר נושא" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="car-search">
                            עזרה בחיפוש רכב
                          </SelectItem>
                          <SelectItem value="dealer-join">
                            הצטרפות כסוחר
                          </SelectItem>
                          <SelectItem value="technical">תמיכה טכנית</SelectItem>
                          <SelectItem value="security">בעיית אבטחה</SelectItem>
                          <SelectItem value="partnership">
                            שותפות עסקית
                          </SelectItem>
                          <SelectItem value="complaint">תלונה</SelectItem>
                          <SelectItem value="suggestion">
                            הצעה לשיפור
                          </SelectItem>
                          <SelectItem value="other">אחר</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message">הודעה *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      placeholder="ספר לנו איך נוכל לעזור לך..."
                      rows={6}
                      required
                      className="mt-1"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={
                      isLoading ||
                      !formData.name ||
                      !formData.email ||
                      !formData.message
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin ml-2" />
                        שולח הודעה...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 ml-2" />
                        שלח הודעה
                      </>
                    )}
                  </Button>

                  <div className="text-xs text-gray-500 text-center">
                    על ידי שליחת הודעה אתה מסכים ל
                    <Button
                      variant="link"
                      className="p-0 h-auto text-xs underline"
                      onClick={() => router.push("/info/terms-of-use")}
                    >
                      תנאי השימוש
                    </Button>{" "}
                    ו
                    <Button
                      variant="link"
                      className="p-0 h-auto text-xs underline"
                      onClick={() => router.push("/info/privacy-policy")}
                    >
                      מדיניות הפרטיות
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">דרכי יצירת קשר</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gray-50`}>
                      <method.icon className={`h-5 w-5 ${method.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {method.title}
                      </div>
                      <div className="text-sm text-gray-700 font-medium">
                        {method.value}
                      </div>
                      <div className="text-xs text-gray-500">
                        {method.description}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Help Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">איך נוכל לעזור?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {helpTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <topic.icon className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {topic.title}
                      </div>
                      <div className="text-xs text-gray-600 leading-relaxed">
                        {topic.description}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-blue-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900 mb-2">
                    <Clock className="h-6 w-6 inline-block ml-2" />
                    תגובה תוך 24 שעות
                  </div>
                  <div className="text-sm text-blue-700">
                    אנחנו מתחייבים לחזור אליך בהקדם האפשרי
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="font-semibold text-red-800 mb-2">
                    🚨 בעיה דחופה?
                  </div>
                  <div className="text-sm text-red-700 mb-3">
                    לבעיות אבטחה או הונאות
                  </div>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Phone className="w-4 h-4 ml-1" />
                    חירום: 1-800-AUTIX
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
