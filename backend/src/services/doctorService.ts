import { pool } from '../config/db';

export const DoctorService = {
    async createDoctor(name: string, specialization: string) {
        const res = await pool.query(
            'INSERT INTO doctors (name, specialization) VALUES ($1, $2) RETURNING *',
            [name, specialization]
        );
        return res.rows[0];
    },

    async getAllDoctors() {
        const res = await pool.query('SELECT * FROM doctors ORDER BY name ASC');
        return res.rows;
    }
};
