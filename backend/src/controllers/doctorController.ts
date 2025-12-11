import { Request, Response } from 'express';
import { DoctorService } from '../services/doctorService';

export const DoctorController = {
    async create(req: Request, res: Response) {
        try {
            const { name, specialization } = req.body;
            if (!name || !specialization) {
                return res.status(400).json({ error: 'Name and specialization are required' });
            }
            const doctor = await DoctorService.createDoctor(name, specialization);
            res.status(201).json(doctor);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async list(req: Request, res: Response) {
        try {
            const doctors = await DoctorService.getAllDoctors();
            res.json(doctors);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
