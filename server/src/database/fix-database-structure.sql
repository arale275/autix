-- קובץ: server/src/database/fix-database-structure.sql

-- 1. קודם נבדוק איזה dealers חסרים
SELECT 
    u.id as user_id, 
    u.email, 
    u.first_name, 
    u.last_name,
    d.id as dealer_profile_exists
FROM users u
LEFT JOIN dealers d ON u.id = d.user_id
WHERE u.user_type = 'dealer';

-- 2. ניצור dealer profiles לכל המשתמשים מסוג dealer שחסרים
INSERT INTO dealers (user_id, business_name, license_number, address, city, description, verified, rating)
SELECT 
    u.id,
    CONCAT(u.first_name, ' ', u.last_name, ' Motors') as business_name,
    'TBD-' || u.id as license_number,
    'לא צוין' as address,
    'לא צוין' as city,
    'עדיין לא הוזן תיאור עסק' as description,
    false as verified,
    0.00 as rating
FROM users u
LEFT JOIN dealers d ON u.id = d.user_id
WHERE u.user_type = 'dealer' AND d.id IS NULL;

-- 3. בדיקה אחרי התיקון
SELECT 
    u.id as user_id, 
    u.email, 
    u.first_name || ' ' || u.last_name as full_name,
    d.id as dealer_id,
    d.business_name
FROM users u
JOIN dealers d ON u.id = d.user_id
WHERE u.user_type = 'dealer'
ORDER BY u.id;