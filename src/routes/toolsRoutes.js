

import { Router } from "express";
import { createToolSchema, getToolsSchema } from "../validations/validateTool.js";
import { createTool, getTools } from "../controllers/toolsController.js";
import { authenticate } from "../middleware/authenticate.js";
import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { deleteTool } from '../controllers/toolController.js';
import { celebrate } from 'celebrate';
import { createBookingSchema } from '../validations/bookingValidations.js';
import { createBooking } from '../controllers/bookingController.js';

const router = Router();

router.post("/tools",  authenticate, celebrate(createToolSchema), createTool);
router.get("/tools", celebrate(getToolsSchema), getTools);





// DELETE /tools/:id — видалення інструменту власником
router.delete('/tools/:id', authenticate, deleteTool);

router.post('/:toolId/bookings', authenticate, celebrate(createBookingSchema), createBooking);


export default router;
