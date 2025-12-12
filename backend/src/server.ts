import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { pool } from './config/db';

dotenv.config();

console.log("Starting backend server...");
console.log("Environment:", process.env.NODE_ENV);
console.log("Database URL present:", !!process.env.DATABASE_URL);

const app = express();

app.use(cors());
app.use(express.json());

import apiRoutes from './routes/api';
app.use('/api', apiRoutes);

app.get('/health', async (req, res) => {
    try {
        const client = await pool.connect();
        client.release();
        res.json({ status: 'OK', db: 'Connected' });
    } catch (error: any) {
        console.error("Health check DB error:", error);
        res.status(500).json({ status: 'ERROR', db: error.message });
    }
});

// Serve Frontend Static Files
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../../frontend/dist');
    console.log("Serving frontend from:", frontendPath);

    if (fs.existsSync(frontendPath)) {
        app.use(express.static(frontendPath));
        // Use RegExp for catch-all to avoid Express 5 path-to-regexp errors with '*'
        app.get(/.*/, (req, res) => {
            res.sendFile(path.join(frontendPath, 'index.html'));
        });
        console.log("Frontend static files serving enabled.");
    } else {
        console.error("CRITICAL: Frontend build directory not found at:", frontendPath);
        app.get('/', (req, res) => res.send("Backend is running, but Frontend build not found. Chech build logs."));
    }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
