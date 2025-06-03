import { Router } from 'express';
import { 
  uploadCarImage, 
  getCarImages, 
  setMainImage, 
  deleteCarImage,
  uploadMiddleware 
} from '../controllers/image.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// הוספת תמונה לרכב (dealers בלבד)
router.post(
  '/cars/:carId/images', 
  authenticateToken, 
  uploadMiddleware, 
  uploadCarImage
);

// קבלת כל התמונות של רכב
router.get('/cars/:carId/images', getCarImages);

// הגדרת תמונה ראשית (dealers בלבד)
router.put(
  '/cars/:carId/images/:imageId/main', 
  authenticateToken, 
  setMainImage
);

// מחיקת תמונה (dealers בלבד)
router.delete(
  '/images/:imageId', 
  authenticateToken, 
  deleteCarImage
);

export default router;
