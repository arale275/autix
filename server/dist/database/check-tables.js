"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_config_1 = __importDefault(require("../config/database.config"));
async function checkTables() {
    try {
        console.log('🔍 Checking created tables...\n');
        // בדיקת רשימת טבלאות
        const tablesResult = await database_config_1.default.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
        console.log('📋 Created tables:');
        tablesResult.rows.forEach(row => {
            console.log(`  ✅ ${row.table_name}`);
        });
        // בדיקת מספר עמודות בכל טבלה
        console.log('\n📊 Table structures:');
        for (const table of tablesResult.rows) {
            const columnsResult = await database_config_1.default.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position;
      `, [table.table_name]);
            console.log(`\n${table.table_name}:`);
            columnsResult.rows.forEach(col => {
                console.log(`  - ${col.column_name} (${col.data_type})`);
            });
        }
    }
    catch (error) {
        console.error('❌ Error checking tables:', error);
    }
    finally {
        await database_config_1.default.end();
    }
}
checkTables();
