// src/components/forms/ImageUploader.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { Upload, X, Camera, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

interface ImageUploaderProps {
  onImagesChange: (files: File[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
  disabled?: boolean;
  existingImages?: string[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesChange,
  maxImages = 5,
  maxFileSize = 5,
  disabled = false,
  existingImages = []
}) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');

  const validateFile = (file: File): string | null => {
    // בדיקת סוג קובץ
    if (!file.type.startsWith('image/')) {
      return 'רק קבצי תמונה מותרים';
    }

    // בדיקת גודל
    if (file.size > maxFileSize * 1024 * 1024) {
      return `גודל הקובץ חייב להיות קטן מ-${maxFileSize}MB`;
    }

    return null;
  };

  const processFiles = useCallback((files: FileList) => {
    setError('');
    const newImages: ImageFile[] = [];
    const currentCount = images.length + existingImages.length;

    Array.from(files).forEach((file) => {
      // בדיקת מגבלת כמות
      if (currentCount + newImages.length >= maxImages) {
        setError(`ניתן להעלות מקסימום ${maxImages} תמונות`);
        return;
      }

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      const id = Math.random().toString(36).substr(2, 9);
      const preview = URL.createObjectURL(file);
      
      newImages.push({ file, preview, id });
    });

    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesChange(updatedImages.map(img => img.file));
    }
  }, [images, existingImages.length, maxImages, maxFileSize, onImagesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // איפוס הinput
    e.target.value = '';
  }, [processFiles]);

  const removeImage = useCallback((id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    onImagesChange(updatedImages.map(img => img.file));
    
    // שחרור זיכרון
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
  }, [images, onImagesChange]);

  // ניקוי זיכרון בעת unmount
  React.useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, []);

  const totalImages = images.length + existingImages.length;
  const canAddMore = totalImages < maxImages && !disabled;

  return (
    <div className="space-y-4">
      {/* אזור העלאה */}
      {canAddMore && (
        <Card className={`border-2 border-dashed transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
          <div
            className="p-6"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !disabled && document.getElementById('file-input')?.click()}
          >
            <div className="text-center">
              <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="text-lg font-medium text-gray-900 mb-2">
                העלה תמונות
              </div>
              <div className="text-sm text-gray-600 mb-4">
                גרור ושחרר תמונות או לחץ לבחירה
              </div>
              <div className="text-xs text-gray-500">
                מקסימום {maxImages} תמונות, עד {maxFileSize}MB כל אחת
              </div>
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                disabled={disabled}
              />
            </div>
          </div>
        </Card>
      )}

      {/* שגיאות */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* תמונות קיימות */}
      {existingImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">תמונות קיימות</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {existingImages.map((url, index) => (
              <div key={`existing-${index}`} className="relative group">
                <img
                  src={url}
                  alt={`תמונה קיימת ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* תמונות חדשות */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            תמונות חדשות ({images.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.preview}
                  alt="תמונה חדשה"
                  className="w-full h-24 object-cover rounded-lg border"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity" />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(image.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* מונה תמונות */}
      <div className="text-xs text-gray-500 text-center">
        {totalImages} מתוך {maxImages} תמונות
      </div>
    </div>
  );
};