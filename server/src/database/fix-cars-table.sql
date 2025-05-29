-- server/src/database/fix-cars-table.sql

-- בדיקת מבנה הטבלה הנוכחי
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'cars' 
ORDER BY ordinal_position;

-- הוספת עמודות חסרות לטבלת cars
ALTER TABLE cars ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE cars ADD COLUMN IF NOT EXISTS engine_size VARCHAR(10);
ALTER TABLE cars ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- בדיקה אחרי התיקון
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'cars' 
ORDER BY ordinal_position;