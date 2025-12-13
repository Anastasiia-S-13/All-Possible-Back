import express from 'express';
import { celebrate } from 'celebrate';
import { checkAvailability, createBooking } from '../controllers/bookingController.js';
import { createBookingSchema } from '../validations/bookingValidations.js';
import { authenticate } from '../middleware/authenticate.js';
// import { authenticate } from '../middleware/authenticate.js';



const router = express.Router();

router.get('/tools/:toolId/availability', checkAvailability);

router.post('/bookings/:toolId', authenticate, celebrate(createBookingSchema), createBooking);
