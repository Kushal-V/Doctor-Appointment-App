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

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
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
        // Use middleware for catch-all to avoid routing syntax issues completely
        app.use((req, res) => {
            res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
                if (err) {
                    console.error("Error sending frontend file:", err);
                    res.status(500).send("Error loading frontend");
                }
            });
        });
        console.log("Frontend static files serving enabled.");
    } else {
        console.error("CRITICAL: Frontend build directory not found at:", frontendPath);
        app.get('/', (req, res) => res.send("Backend is running, but Frontend build not found. Check build logs."));
    }
}

const PORT = parseInt(process.env.PORT || '5000', 10);
// Explicitly bind to 0.0.0.0 for Docker/Railway environments
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Ready to accept connections at http://0.0.0.0:${PORT}`);
});
