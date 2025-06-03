import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export const s3Config = {
  region: 'eu-central-1',
  bucket: 'autix-bucket-1',
  cdnDomain: 'd1so39s8vsjy.cloudfront.net',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
};

export const s3Client = new S3Client(s3Config);

export interface ImageUploadResult {
  originalUrl: string;
  thumbnailUrl: string;
  key: string;
  thumbnailKey: string;
  fileSize: number;
  contentType: string;
}

export class ImageService {
  private static getImageKey(carId: number, filename: string, isThumb = false): string {
    const folder = isThumb ? 'thumbnails' : 'images';
    const uniqueId = uuidv4();
    const extension = filename.split('.').pop();
    return `cars/${carId}/${folder}/${uniqueId}.${extension}`;
  }

  private static getCdnUrl(key: string): string {
    return `https://${s3Config.cdnDomain}/${key}`;
  }

  static async uploadImage(
    carId: number,
    buffer: Buffer,
    originalFilename: string,
    contentType: string
  ): Promise<ImageUploadResult> {
    try {
      const imageKey = this.getImageKey(carId, originalFilename);
      const thumbnailKey = this.getImageKey(carId, originalFilename, true);

      // עיבוד תמונה ראשית (מקס 1200x800)
      const processedImage = await sharp(buffer)
        .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

      // יצירת thumbnail (300x200)
      const thumbnail = await sharp(buffer)
        .resize(300, 200, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer();

      // העלאת תמונה ראשית
      await s3Client.send(new PutObjectCommand({
        Bucket: s3Config.bucket,
        Key: imageKey,
        Body: processedImage,
        ContentType: 'image/jpeg',
        CacheControl: 'max-age=31536000',
      }));

      // העלאת thumbnail
      await s3Client.send(new PutObjectCommand({
        Bucket: s3Config.bucket,
        Key: thumbnailKey,
        Body: thumbnail,
        ContentType: 'image/jpeg',
        CacheControl: 'max-age=31536000',
      }));

      return {
        originalUrl: this.getCdnUrl(imageKey),
        thumbnailUrl: this.getCdnUrl(thumbnailKey),
        key: imageKey,
        thumbnailKey: thumbnailKey,
        fileSize: processedImage.length,
        contentType: 'image/jpeg',
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  static async deleteImage(key: string, thumbnailKey?: string): Promise<void> {
    try {
      await s3Client.send(new DeleteObjectCommand({
        Bucket: s3Config.bucket,
        Key: key,
      }));

      if (thumbnailKey) {
        await s3Client.send(new DeleteObjectCommand({
          Bucket: s3Config.bucket,
          Key: thumbnailKey,
        }));
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }
}
