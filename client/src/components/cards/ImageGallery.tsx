// src/components/cards/ImageGallery.tsx
'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Star, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface CarImage {
  id: number;
  image_url: string;
  thumbnail_url?: string;
  is_main: boolean;
  display_order: number;
}

interface ImageGalleryProps {
  images: {
    main: CarImage | null;
    gallery: CarImage[];
    count: number;
  };
  isOwner?: boolean; // האם המשתמש הוא הבעלים של הרכב
  onSetMain?: (imageId: number) => void;
  onDelete?: (imageId: number) => void;
  className?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  isOwner = false,
  onSetMain,
  onDelete,
  className = ''
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // רשימת כל התמונות (ראשית + גלריה)
  const allImages = [
    ...(images.main ? [images.main] : []),
    ...images.gallery
  ];

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;
    
    const newIndex = direction === 'prev' 
      ? selectedImageIndex - 1 
      : selectedImageIndex + 1;
    
    if (newIndex >= 0 && newIndex < allImages.length) {
      setSelectedImageIndex(newIndex);
    }
  };

  // מחיקת תמונה
  const handleDelete = (imageId: number) => {
    if (onDelete) {
      onDelete(imageId);
    }
    closeModal();
  };

  // הגדרת תמונה ראשית
  const handleSetMain = (imageId: number) => {
    if (onSetMain) {
      onSetMain(imageId);
    }
  };

  if (images.count === 0) {
    return (
      <Card className={`p-8 text-center bg-gray-50 ${className}`}>
        <div className="text-gray-400 mb-2">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
            ���
          </div>
          <p className="text-lg font-medium">אין תמונות</p>
          <p className="text-sm">לא הועלו תמונות לרכב זה</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* תמונה ראשית */}
      {images.main && (
        <div className="mb-4">
          <div className="relative group cursor-pointer">
            <img
              src={images.main.image_url}
              alt="תמונה ראשית"
              className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
              onClick={() => openModal(0)}
            />
            
            {/* אינדיקטור תמונה ראשית */}
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Star className="w-3 h-3" />
              ראשית
            </div>

            {/* תפריט בעלים */}
            {isOwner && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => handleDelete(images.main!.id)}
                      className="text-red-600"
                    >
                      מחק תמונה
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* אינדיקטור הקלקה */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-opacity flex items-center justify-center">
              <div className="bg-white bg-opacity-80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* גלריית תמונות */}
      {images.gallery.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            תמונות נוספות ({images.gallery.length})
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.gallery.map((image, index) => (
              <div key={image.id} className="relative group cursor-pointer">
                <img
                  src={image.thumbnail_url || image.image_url}
                  alt={`תמונה ${index + 1}`}
                  className="w-full h-20 sm:h-24 object-cover rounded-lg border hover:shadow-md transition-shadow"
                  onClick={() => openModal(images.main ? index + 1 : index)}
                />
                
                {/* תפריט בעלים */}
                {isOwner && (
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleSetMain(image.id)}>
                          קבע כראשית
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(image.id)}
                          className="text-red-600"
                        >
                          מחק תמונה
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

                {/* אפקט hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal תצוגה מלאה */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black">
          {selectedImageIndex !== null && allImages[selectedImageIndex] && (
            <div className="relative">
              {/* כפתור סגירה */}
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* תמונה */}
              <img
                src={allImages[selectedImageIndex].image_url}
                alt={`תמונה ${selectedImageIndex + 1}`}
                className="w-full max-h-[80vh] object-contain"
              />

              {/* ניווט */}
              {allImages.length > 1 && (
                <>
                  {selectedImageIndex > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateImage('prev')}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                  )}
                  
                  {selectedImageIndex < allImages.length - 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateImage('next')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  )}
                </>
              )}

              {/* מידע תמונה */}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded">
                <div className="text-sm">
                  {selectedImageIndex + 1} מתוך {allImages.length}
                  {allImages[selectedImageIndex].is_main && (
                    <span className="ml-2 text-yellow-400">★ ראשית</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
