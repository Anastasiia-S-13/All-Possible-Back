import { Router } from 'express';
import { getPublicUserById } from '../controllers/publicUsersController.js';

const router = Router();

router.get('/user/:id', getPublicUserById);

export default router;
