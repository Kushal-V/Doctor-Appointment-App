import { pool } from '../config/db';

export const BookingService = {
    async createBooking(slotId: string, patientName: string) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // 1. Check if the slot exists
            const slotRes = await client.query('SELECT * FROM slots WHERE id = $1', [slotId]);
            if (slotRes.rows.length === 0) {
                throw new Error('Slot not found');
            }

            // 2. Attempt to insert the booking. 
            // The UNIQUE INDEX (unique_active_booking) on (slot_id) WHERE status IN ('PENDING', 'CONFIRMED')
            // will throw an error immediately if a concurrent transaction tries to insert.
            // We start with CONFIRMED for simplicity as per "Doctor Appointment" logic usually implies immediate blockage, 
            // or we can do PENDING if we had a payment gateway. Let's do CONFIRMED for this assessment scope.
            const insertQuery = `
        INSERT INTO bookings (slot_id, patient_name, status)
        VALUES ($1, $2, 'CONFIRMED')
        RETURNING *
      `;
            const res = await client.query(insertQuery, [slotId, patientName]);

            await client.query('COMMIT');
            return res.rows[0];

        } catch (error: any) {
            await client.query('ROLLBACK');

            // Check for Unique Constraint Violation (Postgres Code 23505)
            if (error.code === '23505') {
                throw new Error('Slot is already booked');
            }
            throw error;
        } finally {
            client.release();
        }
    }
};
