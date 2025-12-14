import express from 'express';
import { celebrate } from 'celebrate';

import { authenticate } from '../middleware/authenticate.js';
import { getToolById, deleteTool } from '../controllers/toolController.js';
import { createBooking } from '../controllers/bookingController.js';
import { createBookingSchema } from '../validations/bookingValidations.js';

const router = express.Router();

router.get('/:id', getToolById);

router.delete('/:id', authenticate, deleteTool);

router.post(
  '/:toolId/bookings',
  authenticate,
  celebrate(createBookingSchema),
  createBooking
);

export default router;
