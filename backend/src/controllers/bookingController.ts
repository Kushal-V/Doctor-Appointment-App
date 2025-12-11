import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService';

export const BookingController = {
    async create(req: Request, res: Response) {
        try {
            const { slotId, patientName } = req.body;
            if (!slotId || !patientName) {
                return res.status(400).json({ error: 'Slot ID and Patient Name are required' });
            }

            const booking = await BookingService.createBooking(slotId, patientName);
            res.status(201).json(booking);
        } catch (error: any) {
            if (error.message === 'Slot is already booked') {
                return res.status(409).json({ error: 'Slot is already booked' });
            }
            if (error.message === 'Slot not found') {
                return res.status(404).json({ error: 'Slot not found' });
            }
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
