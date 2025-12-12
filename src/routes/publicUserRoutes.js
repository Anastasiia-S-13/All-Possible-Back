import { Router } from 'express';
import { getPublicUserById } from '../controllers/publicUsersController.js';

const router = Router();

router.get('/users/:id', getPublicUserById);

export default router;
