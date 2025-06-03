import { Request, Response } from "express";
import multer from "multer";
import { ImageService } from "../config/s3.config";
import { CarImageModel } from "../models/car-image.model";

// הגדרת multer לעיבוד קבצים
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB מקסימום
  },
  fileFilter: (req, file, cb) => {
    // רק תמונות
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export const uploadCarImage = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const { isMain = false } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // העלאת התמונה ל-Lightsail
    const uploadResult = await ImageService.uploadImage(
      parseInt(carId),
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // שמירה בדאטה בייס
    const imageRecord = await CarImageModel.create({
      car_id: parseInt(carId),
      image_url: uploadResult.originalUrl,
      thumbnail_url: uploadResult.thumbnailUrl,
      is_main: isMain === "true",
      original_filename: req.file.originalname,
      file_size: uploadResult.fileSize,
      content_type: uploadResult.contentType,
    });

    res.status(201).json({
      message: "Image uploaded successfully",
      image: imageRecord,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      error: "Failed to upload image",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getCarImages = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;

    const images = await CarImageModel.getCarImages(parseInt(carId));

    res.json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("Error fetching car images:", error);
    res.status(500).json({
      error: "Failed to fetch images",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const setMainImage = async (req: Request, res: Response) => {
  try {
    const { carId, imageId } = req.params;

    await CarImageModel.setMainImage(parseInt(carId), parseInt(imageId));

    res.json({
      success: true,
      message: "Main image updated successfully",
    });
  } catch (error) {
    console.error("Error setting main image:", error);
    res.status(500).json({
      error: "Failed to set main image",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteCarImage = async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;

    // קבלת פרטי התמונה
    const image = await CarImageModel.getImageById(parseInt(imageId));
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // מחיקה מהדאטה בייס
    await CarImageModel.delete(parseInt(imageId));

    // מחיקה מ-Lightsail (אופציונלי - אפשר לעשות cleanup job)
    try {
      const imageKey = image.image_url.split("/").slice(-4).join("/"); // חילוץ key מה-URL
      const thumbnailKey = image.thumbnail_url?.split("/").slice(-5).join("/");
      await ImageService.deleteImage(imageKey, thumbnailKey);
    } catch (s3Error) {
      console.warn("Failed to delete from S3:", s3Error);
      // לא נעצור בגלל זה - התמונה נמחקה מהDB
    }

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      error: "Failed to delete image",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Middleware לטיפול בעיבוד קבצים
export const uploadMiddleware = upload.single("image");
