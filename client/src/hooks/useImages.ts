// src/hooks/useImages.ts - תוקן עם tokenManager
"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { tokenManager } from "@/lib/api"; // ✅ השתמש ב-tokenManager

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
        // ✅ השתמש ב-tokenManager במקום localStorage
        const token = tokenManager.getToken();
        if (!token) {
          throw new Error("נדרשת התחברות להעלאת תמונות");
        }

        const formData = new FormData();
        formData.append("image", file); // ✅ כמו שהשרת מצפה
        formData.append("isMain", isMain.toString());

        const response = await fetch(`${API_URL}/api/cars/${carId}/images`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ כמו שהשרת מצפה
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || errorData.message || "Failed to upload image"
          );
        }

        const data = await response.json();

        // ✅ כמו שהשרת מחזיר
        if (data.image) {
          return data.image;
        } else {
          throw new Error(data.message || "Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error; // זרוק את השגיאה הלאה
      }
    },
    []
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

  // ✅ העלאת מספר תמונות - תיקון ההודעות
  const uploadMultipleImages = useCallback(
    async (carId: number, files: File[]): Promise<boolean> => {
      try {
        setUploading(true);

        // ✅ בדיקת authentication מראש
        const token = tokenManager.getToken();
        if (!token) {
          toast.error("נדרשת התחברות להעלאת תמונות");
          return false;
        }

        const uploadedImages: CarImage[] = [];
        const failedUploads: string[] = [];

        // העלאה רצופה עם טיפול בשגיאות
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const isMain = i === 0 && uploadedImages.length === 0; // רק אם זו התמונה הראשונה שהועלתה

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

        // ✅ הודעות מסכמות חכמות
        if (uploadedImages.length > 0) {
          if (failedUploads.length === 0) {
            // כל התמונות הועלו בהצלחה
            toast.success(`${uploadedImages.length} תמונות הועלו בהצלחה!`);
          } else {
            // חלק הועלו, חלק נכשלו
            toast.success(`${uploadedImages.length} תמונות הועלו בהצלחה`);
            toast.error(
              `${failedUploads.length} תמונות נכשלו: ${failedUploads.join(
                ", "
              )}`
            );
          }
          return true;
        } else {
          // כל התמונות נכשלו
          toast.error("שגיאה בהעלאת התמונות");
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
    [uploadImageSilent]
  );

  // הגדרת תמונה ראשית
  const setMainImage = useCallback(
    async (carId: number, imageId: number): Promise<boolean> => {
      try {
        const token = tokenManager.getToken(); // ✅ השתמש ב-tokenManager
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
    []
  );

  // מחיקת תמונה
  const deleteImage = useCallback(async (imageId: number): Promise<boolean> => {
    try {
      const token = tokenManager.getToken(); // ✅ השתמש ב-tokenManager
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
  }, []);

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
