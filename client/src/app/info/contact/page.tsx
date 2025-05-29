"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // סימולציית שליחת טופס עם השהיה
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center px-4 relative">
        {/* כפתור חזרה לדף הבית */}
        <Button
          onClick={handleBackToHome}
          variant="outline"
          className="absolute top-4 right-4 z-10 bg-white shadow-md hover:bg-gray-50 
                     flex items-center gap-2 px-4 py-2 text-sm font-medium"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה לדף הבית
        </Button>

        <div className="max-w-md w-full">
          <Card className="text-center shadow-lg">
            <CardContent className="p-10">
              <div className="text-6xl mb-6 text-green-500">✅</div>
              <h1 className="text-3xl font-extrabold mb-4">
                ההודעה נשלחה בהצלחה!
              </h1>
              <p className="text-gray-600 mb-8">
                תודה על פנייתך. נחזור אליך בהקדם.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="px-8 py-3"
                >
                  שלח הודעה נוספת
                </Button>
                <Button
                  onClick={handleBackToHome}
                  variant="outline"
                  className="px-8 py-3"
                >
                  חזרה לדף הבית
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex flex-col items-center px-4 relative">
      {/* כפתור חזרה לדף הבית */}
      <Button
        onClick={handleBackToHome}
        variant="outline"
        className="absolute top-4 right-4 z-10 bg-white shadow-md hover:bg-gray-50 
                   flex items-center gap-2 px-4 py-2 text-sm font-medium"
      >
        <ArrowRight className="w-4 h-4" />
        חזרה לדף הבית
      </Button>

      <div className="max-w-3xl w-full">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-3">צור קשר</h1>
          <p className="text-gray-500 text-lg">
            נשמח לעזור לך ולענות על כל שאלה
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">שלח הודעה</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Input
                placeholder="שם מלא"
                required
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition"
              />
              <Input
                placeholder="טלפון"
                type="tel"
                required
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition"
              />
              <Input
                placeholder="אימייל"
                type="email"
                required
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition"
              />
              <Textarea
                placeholder="הודעה"
                rows={5}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition resize-none"
              />

              <Button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md
                           hover:bg-blue-700 active:bg-blue-800 transition duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "שולח..." : "שלח הודעה"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
