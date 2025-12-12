import { Router } from 'express';
import { celebrate } from 'celebrate';
import { registerUserSchema, loginUserSchema } from '../validations/authValidation.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  getCurrentUser,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', celebrate(registerUserSchema), registerUser);
router.post('/login', celebrate(loginUserSchema), loginUser);
router.post('/logout', authenticate, logoutUser);
router.post('/refresh', refreshSession);
router.get('/me', authenticate, getCurrentUser);

export default router;
