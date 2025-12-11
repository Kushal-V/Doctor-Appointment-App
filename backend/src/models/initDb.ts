import { pool } from '../config/db';
import fs from 'fs';
import path from 'path';

const initDb = async () => {
    try {
        const client = await pool.connect();
        try {
            const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
            await client.query(sql);
            console.log('Database schema applied successfully.');
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Error applying database schema:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
};

initDb();
