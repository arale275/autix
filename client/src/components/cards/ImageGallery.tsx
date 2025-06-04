// src/components/cards/ImageGallery.tsx - Fixed Version
"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Star,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  isOwner?: boolean;
  onSetMain?: (imageId: number) => void;
  onDelete?: (imageId: number) => void;
  className?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  isOwner = false,
  onSetMain,
  onDelete,
  className = "",
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allImages = [...(images.main ? [images.main] : []), ...images.gallery];

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImageIndex === null) return;

    const newIndex =
      direction === "prev" ? selectedImageIndex - 1 : selectedImageIndex + 1;

    if (newIndex >= 0 && newIndex < allImages.length) {
      setSelectedImageIndex(newIndex);
    }
  };

  // ✅ Fixed: Added event.stopPropagation() to prevent modal opening
  const handleDelete = (imageId: number, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }

    if (onDelete && window.confirm("האם אתה בטוח שברצונך למחוק את התמונה?")) {
      onDelete(imageId);
    }
  };

  // ✅ Fixed: Added event.stopPropagation() to prevent modal opening
  const handleSetMain = (imageId: number, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }

    if (onSetMain) {
      onSetMain(imageId);
    }
  };

  if (images.count === 0) {
    return (
      <Card className={`p-8 text-center bg-gray-50 ${className}`}>
        <div className="text-gray-400 mb-2">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
            📷
          </div>
          <p className="text-lg font-medium">אין תמונות</p>
          <p className="text-sm">לא הועלו תמונות לרכב זה</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={className}>
      {images.main && (
        <div className="mb-4">
          <div className="relative group cursor-pointer">
            <img
              src={images.main.image_url}
              alt="תמונה ראשית"
              className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
              onClick={() => openModal(0)}
            />

            {/* Main Image Badge */}
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Star className="w-3 h-3" />
              ראשית
            </div>

            {/* Owner Actions - Fixed */}
            {isOwner && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                      onClick={(e) => e.stopPropagation()} // ✅ Prevent modal opening
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => handleDelete(images.main!.id, e)}
                      className="text-red-600"
                    >
                      מחק תמונה
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* ✅ Fixed: Moved view hint to bottom */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/70 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <Eye className="w-3 h-3" />
                לחץ לצפייה מלאה
              </div>
            </div>
          </div>
        </div>
      )}

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

                {/* Owner Actions for Gallery Images - Fixed */}
                {isOwner && (
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-6 w-6 p-0 bg-white/90 hover:bg-white shadow-sm"
                          onClick={(e) => e.stopPropagation()} // ✅ Prevent modal opening
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => handleSetMain(image.id, e)}
                        >
                          קבע כראשית
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => handleDelete(image.id, e)}
                          className="text-red-600"
                        >
                          מחק תמונה
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity" />

                {/* ✅ View hint for gallery images */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/70 text-white px-2 py-0.5 rounded text-xs">
                    לחץ לצפייה
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Full Size Images */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black">
          {selectedImageIndex !== null && allImages[selectedImageIndex] && (
            <div className="relative">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Main Image */}
              <img
                src={allImages[selectedImageIndex].image_url}
                alt={`תמונה ${selectedImageIndex + 1}`}
                className="w-full max-h-[80vh] object-contain"
              />

              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  {selectedImageIndex > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateImage("prev")}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                  )}

                  {selectedImageIndex < allImages.length - 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateImage("next")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  )}
                </>
              )}

              {/* Image Info */}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded">
                <div className="text-sm">
                  {selectedImageIndex + 1} מתוך {allImages.length}
                  {allImages[selectedImageIndex].is_main && (
                    <span className="ml-2 text-yellow-400">★ ראשית</span>
                  )}
                </div>
              </div>

              {/* ✅ Owner Actions in Modal */}
              {isOwner && (
                <div className="absolute top-4 left-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {!allImages[selectedImageIndex].is_main && (
                        <DropdownMenuItem
                          onClick={() => {
                            handleSetMain(allImages[selectedImageIndex].id);
                            closeModal();
                          }}
                        >
                          קבע כראשית
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          handleDelete(allImages[selectedImageIndex].id);
                          closeModal();
                        }}
                        className="text-red-600"
                      >
                        מחק תמונה
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
