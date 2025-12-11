import { Router } from 'express';
import { DoctorController } from '../controllers/doctorController';
import { SlotController } from '../controllers/slotController';
import { BookingController } from '../controllers/bookingController';

const router = Router();

// Doctor Routes
router.post('/doctors', DoctorController.create);
router.get('/doctors', DoctorController.list);

// Slot Routes
router.post('/slots', SlotController.create);
router.get('/slots', SlotController.list);

// Booking Routes
router.post('/bookings', BookingController.create);

export default router;
