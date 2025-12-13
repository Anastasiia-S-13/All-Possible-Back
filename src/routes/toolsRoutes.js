import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { deleteTool } from '../controllers/toolController.js';

const router = express.Router();

// DELETE /tools/:id — видалення інструменту власником
router.delete('/tools/:id', authenticate, deleteTool);

export default router;
