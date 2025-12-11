import { pool } from '../config/db';

export const SlotService = {
  async createSlot(doctorId: string, startTime: string, endTime: string) {
    const res = await pool.query(
      'INSERT INTO slots (doctor_id, start_time, end_time) VALUES ($1, $2, $3) RETURNING id, doctor_id as "doctorId", start_time as "startTime", end_time as "endTime"',
      [doctorId, startTime, endTime]
    );
    return res.rows[0];
  },

  async getSlots(doctorId?: string) {
    let query = `
      SELECT 
        s.id,
        s.doctor_id as "doctorId",
        s.start_time as "startTime",
        s.end_time as "endTime",
        CASE 
          WHEN b.status IS NOT NULL THEN b.status
          ELSE 'AVAILABLE'
        END as status,
        d.name as doctor_name,
        b.patient_name as "patientName"
      FROM slots s
      LEFT JOIN bookings b ON s.id = b.slot_id AND b.status IN ('PENDING', 'CONFIRMED')
      LEFT JOIN doctors d ON s.doctor_id = d.id
    `;

    const params: any[] = [];
    if (doctorId && doctorId !== 'undefined') {
      query += ` WHERE s.doctor_id = $1`;
      params.push(doctorId);
    }

    query += ` ORDER BY s.start_time ASC`;

    const res = await pool.query(query, params);
    return res.rows;
  }
};
