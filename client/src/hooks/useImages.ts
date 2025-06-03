// src/hooks/useImages.ts - קוד מלא ומתוקן
"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface CarImage {
  id: number;
  car_id: number;
  image_url: string;
  thumbnail_url?: string;
  is_main: boolean;
  display_order: number;
  original_filename?: string;
  file_size?: number;
  content_type?: string;
  created_at: string;
  updated_at: string;
}

export interface CarImagesResponse {
  main: CarImage | null;
  gallery: CarImage[];
  count: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.autix.co.il";

export const useImages = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Helper function to get token
  const getToken = useCallback(async () => {
    try {
      // נסה tokenManager אם קיים
      const { tokenManager } = await import("@/lib/api");
      return tokenManager.getToken();
    } catch (error) {
      // אם tokenManager לא עובד, נסה localStorage
      return (
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("auth") ||
        sessionStorage.getItem("token")
      );
    }
  }, []);

  // קבלת תמונות רכב
  const fetchCarImages = useCallback(
    async (carId: number): Promise<CarImagesResponse | null> => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/api/cars/${carId}/images`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const data = await response.json();

        if (data.success) {
          return data.data;
        } else {
          throw new Error(data.message || "Failed to fetch images");
        }
      } catch (error) {
        console.error("Error fetching car images:", error);
        toast.error("שגיאה בטעינת התמונות");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // העלאת תמונה (ללא הודעות - למען uploadMultipleImages)
  const uploadImageSilent = useCallback(
    async (
      carId: number,
      file: File,
      isMain: boolean = false
    ): Promise<CarImage | null> => {
      try {
        const token = await getToken();

        if (!token) {
          throw new Error("נדרשת התחברות להעלאת תמונות");
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("isMain", isMain.toString());

        console.log(
          "🔄 Uploading image:",
          file.name,
          "to car:",
          carId,
          "isMain:",
          isMain
        );

        const response = await fetch(`${API_URL}/api/cars/${carId}/images`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        console.log("📡 Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            error: `Server error: ${response.status}`,
          }));
          console.error("❌ Server error:", errorData);
          throw new Error(
            errorData.error ||
              errorData.message ||
              `Server error: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("✅ Upload success:", data);

        if (data.image) {
          return data.image;
        } else {
          throw new Error(data.message || "No image returned from server");
        }
      } catch (error) {
        console.error("💥 Upload error:", error);
        throw error;
      }
    },
    [getToken]
  );

  // העלאת תמונה עם הודעות (לשימוש ישיר)
  const uploadImage = useCallback(
    async (
      carId: number,
      file: File,
      isMain: boolean = false
    ): Promise<CarImage | null> => {
      try {
        setUploading(true);
        const result = await uploadImageSilent(carId, file, isMain);
        toast.success("התמונה הועלתה בהצלחה!");
        return result;
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "שגיאה בהעלאת התמונה"
        );
        return null;
      } finally {
        setUploading(false);
      }
    },
    [uploadImageSilent]
  );

  // העלאת מספר תמונות עם לוגיקה חכמה לתמונה ראשית
  const uploadMultipleImages = useCallback(
    async (
      carId: number,
      files: File[],
      existingImages?: any[] // תמונות קיימות לבדיקה
    ): Promise<boolean> => {
      try {
        setUploading(true);

        // בדיקת authentication מראש
        const token = await getToken();
        if (!token) {
          toast.error("נדרשת התחברות להעלאת תמונות");
          return false;
        }

        // בדוק אם יש תמונה ראשית קיימת
        const hasMainImage = existingImages && existingImages.length > 0;

        const uploadedImages: CarImage[] = [];
        const failedUploads: string[] = [];

        // העלאה רצופה עם טיפול בשגיאות
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          // הגדר תמונה ראשית רק אם:
          // 1. זאת התמונה הראשונה שמועלת
          // 2. אין תמונה ראשית קיימת
          // 3. זו התמונה הראשונה שהועלתה בהצלחה
          const isMain =
            i === 0 && !hasMainImage && uploadedImages.length === 0;

          try {
            const uploadedImage = await uploadImageSilent(carId, file, isMain);
            if (uploadedImage) {
              uploadedImages.push(uploadedImage);
            }
          } catch (error) {
            console.error(`Failed to upload ${file.name}:`, error);
            failedUploads.push(file.name);
          }
        }

        // הודעות מסכמות חכמות
        if (uploadedImages.length > 0) {
          if (failedUploads.length === 0) {
            toast.success(`${uploadedImages.length} תמונות הועלו בהצלחה!`);
          } else {
            toast.success(`${uploadedImages.length} תמונות הועלו בהצלחה`);
            toast.error(
              `${failedUploads.length} תמונות נכשלו: ${failedUploads
                .slice(0, 3)
                .join(", ")}${failedUploads.length > 3 ? "..." : ""}`
            );
          }

          // הודעה על תמונה ראשית
          if (!hasMainImage && uploadedImages.length > 0) {
            toast.info("✨ התמונה הראשונה הוגדרה כתמונה ראשית");
          } else if (hasMainImage) {
            toast.info("💡 תוכל להגדיר תמונה ראשית חדשה בגלריה");
          }

          return true;
        } else {
          // כל התמונות נכשלו
          if (failedUploads.length > 0) {
            toast.error(
              `כל התמונות נכשלו: ${failedUploads[0]}${
                failedUploads.length > 1
                  ? ` ו-${failedUploads.length - 1} נוספות`
                  : ""
              }`
            );
          } else {
            toast.error("שגיאה בהעלאת התמונות");
          }
          return false;
        }
      } catch (error) {
        console.error("Error in uploadMultipleImages:", error);
        toast.error("שגיאה בהעלאת התמונות");
        return false;
      } finally {
        setUploading(false);
      }
    },
    [uploadImageSilent, getToken]
  );

  // הגדרת תמונה ראשית
  const setMainImage = useCallback(
    async (carId: number, imageId: number): Promise<boolean> => {
      try {
        const token = await getToken();
        if (!token) {
          toast.error("נדרשת התחברות");
          return false;
        }

        const response = await fetch(
          `${API_URL}/api/cars/${carId}/images/${imageId}/main`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to set main image");
        }

        const data = await response.json();

        if (data.success) {
          toast.success("התמונה הראשית עודכנה!");
          return true;
        } else {
          throw new Error(data.message || "Failed to set main image");
        }
      } catch (error) {
        console.error("Error setting main image:", error);
        toast.error("שגיאה בעדכון התמונה הראשית");
        return false;
      }
    },
    [getToken]
  );

  // מחיקת תמונה
  const deleteImage = useCallback(
    async (imageId: number): Promise<boolean> => {
      try {
        const token = await getToken();
        if (!token) {
          toast.error("נדרשת התחברות");
          return false;
        }

        const response = await fetch(`${API_URL}/api/images/${imageId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete image");
        }

        const data = await response.json();

        if (data.success) {
          toast.success("התמונה נמחקה בהצלחה!");
          return true;
        } else {
          throw new Error(data.message || "Failed to delete image");
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error("שגיאה במחיקת התמונה");
        return false;
      }
    },
    [getToken]
  );

  return {
    // States
    loading,
    uploading,

    // Functions
    fetchCarImages,
    uploadImage,
    uploadMultipleImages,
    setMainImage,
    deleteImage,
  };
};
