import { pool } from '../config/db';

export const SlotService = {
    async createSlot(doctorId: string, startTime: string, endTime: string) {
        const res = await pool.query(
            'INSERT INTO slots (doctor_id, start_time, end_time) VALUES ($1, $2, $3) RETURNING *',
            [doctorId, startTime, endTime]
        );
        return res.rows[0];
    },

    async getSlotsByDoctor(doctorId: string) {
        // We also want to know the status of the slot.
        // A slot is "booked" if there is a CONFIRMED or PENDING booking.
        // We can JOIN with bookings table.
        const query = `
      SELECT 
        s.*,
        CASE 
          WHEN b.status IS NOT NULL THEN b.status
          ELSE 'AVAILABLE'
        END as status
      FROM slots s
      LEFT JOIN bookings b ON s.id = b.slot_id AND b.status IN ('PENDING', 'CONFIRMED')
      WHERE s.doctor_id = $1
      ORDER BY s.start_time ASC
    `;
        const res = await pool.query(query, [doctorId]);
        return res.rows;
    }
};
