import { Request, Response } from 'express';
import { SlotService } from '../services/slotService';

export const SlotController = {
    async create(req: Request, res: Response) {
        try {
            const { doctorId, startTime, endTime } = req.body;
            if (!doctorId || !startTime || !endTime) {
                return res.status(400).json({ error: 'Doctor ID, Start Time, and End Time are required' });
            }
            const slot = await SlotService.createSlot(doctorId, startTime, endTime);
            res.status(201).json(slot);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async list(req: Request, res: Response) {
        try {
            const { doctorId } = req.query;
            if (!doctorId) {
                return res.status(400).json({ error: 'Doctor ID is required' });
            }
            const slots = await SlotService.getSlotsByDoctor(doctorId as string);
            res.json(slots);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
