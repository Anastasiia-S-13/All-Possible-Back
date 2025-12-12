import { Router } from 'express';
import { getAllFeedbacks } from '../controllers/feedbacksController.js';
import { celebrate } from 'celebrate';
import { getAllFeedbacksSchema } from '../validations/feedbacksValidation.js';

const router = Router();

router.get('/feedbacks', celebrate(getAllFeedbacksSchema), getAllFeedbacks);

export default router;
