// src/hooks/useImages.ts
'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.autix.co.il';

export const useImages = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // קבלת תמונות רכב
  const fetchCarImages = useCallback(async (carId: number): Promise<CarImagesResponse | null> => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/api/cars/${carId}/images`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch images');
      }
    } catch (error) {
      console.error('Error fetching car images:', error);
      toast.error('שגיאה בטעינת התמונות');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // העלאת תמונה
  const uploadImage = useCallback(async (
    carId: number, 
    file: File, 
    isMain: boolean = false
  ): Promise<CarImage | null> => {
    try {
      setUploading(true);
      
      // בדיקת authentication
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('נדרשת התחברות להעלאת תמונות');
        return null;
      }

      const formData = new FormData();
      formData.append('image', file);
      formData.append('isMain', isMain.toString());

      const response = await fetch(`${API_URL}/api/cars/${carId}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      
      if (data.image) {
        toast.success('התמונה הועלתה בהצלחה!');
        return data.image;
      } else {
        throw new Error(data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'שגיאה בהעלאת התמונה'
      );
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  // העלאת מספר תמונות
  const uploadMultipleImages = useCallback(async (
    carId: number, 
    files: File[]
  ): Promise<CarImage[]> => {
    const uploadedImages: CarImage[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isMain = i === 0; // התמונה הראשונה תהיה ראשית אם אין תמונה ראשית
      
      const uploadedImage = await uploadImage(carId, file, isMain);
      if (uploadedImage) {
        uploadedImages.push(uploadedImage);
      }
    }
    
    return uploadedImages;
  }, [uploadImage]);

  // הגדרת תמונה ראשית
  const setMainImage = useCallback(async (carId: number, imageId: number): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('נדרשת התחברות');
        return false;
      }

      const response = await fetch(`${API_URL}/api/cars/${carId}/images/${imageId}/main`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to set main image');
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('התמונה הראשית עודכנה!');
        return true;
      } else {
        throw new Error(data.message || 'Failed to set main image');
      }
    } catch (error) {
      console.error('Error setting main image:', error);
      toast.error('שגיאה בעדכון התמונה הראשית');
      return false;
    }
  }, []);

  // מחיקת תמונה
  const deleteImage = useCallback(async (imageId: number): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('נדרשת התחברות');
        return false;
      }

      const response = await fetch(`${API_URL}/api/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete image');
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('התמונה נמחקה בהצלחה!');
        return true;
      } else {
        throw new Error(data.message || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('שגיאה במחיקת התמונה');
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
