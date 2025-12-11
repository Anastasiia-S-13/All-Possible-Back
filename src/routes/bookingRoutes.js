import express from 'express';
import { celebrate } from 'celebrate';
import { checkAvailability, createBooking, getAllBookings } from '../controllers/bookingController.js';
import { createBookingSchema } from '../validations/bookingValidations';



const router = express.Router();

router.get('/tools/:toolId/availability', checkAvailability);

router.post('/bookings', `auth`, celebrate(createBookingSchema), createBooking);

router.get('/bookings', getAllBookings); //! тимчасовий ендпоінт
