import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import path from 'path';

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
        res.status(500).json({ status: 'ERROR', db: error.message });
    }
});

// Serve Frontend Static Files
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../../frontend/dist');
    app.use(express.static(frontendPath));

    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
