import pool from '../config/database.config';

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
  created_at: Date;
  updated_at: Date;
}

export interface CreateCarImageData {
  car_id: number;
  image_url: string;
  thumbnail_url?: string;
  is_main?: boolean;
  display_order?: number;
  original_filename?: string;
  file_size?: number;
  content_type?: string;
}

export class CarImageModel {
  static async create(data: CreateCarImageData): Promise<CarImage> {
    const query = `
      INSERT INTO car_images (
        car_id, image_url, thumbnail_url, is_main, display_order,
        original_filename, file_size, content_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      data.car_id,
      data.image_url,
      data.thumbnail_url,
      data.is_main || false,
      data.display_order || 0,
      data.original_filename,
      data.file_size,
      data.content_type,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByCarId(carId: number): Promise<CarImage[]> {
    const query = `
      SELECT * FROM car_images 
      WHERE car_id = $1 
      ORDER BY is_main DESC, display_order ASC, created_at ASC
    `;
    
    const result = await pool.query(query, [carId]);
    return result.rows;
  }

  static async setMainImage(carId: number, imageId: number): Promise<void> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // הסרת דגל main מכל התמונות
      await client.query(
        'UPDATE car_images SET is_main = false WHERE car_id = $1',
        [carId]
      );
      
      // הגדרת תמונה ראשית חדשה
      await client.query(
        'UPDATE car_images SET is_main = true WHERE id = $1 AND car_id = $2',
        [imageId, carId]
      );
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(id: number): Promise<CarImage | null> {
    const query = 'DELETE FROM car_images WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async getCarImages(carId: number): Promise<{
    main: CarImage | null;
    gallery: CarImage[];
    count: number;
  }> {
    const images = await this.findByCarId(carId);
    const main = images.find(img => img.is_main) || null;
    const gallery = images.filter(img => !img.is_main);
    
    return {
      main,
      gallery,
      count: images.length,
    };
  }

  static async getImageById(id: number): Promise<CarImage | null> {
    const query = 'SELECT * FROM car_images WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
}
