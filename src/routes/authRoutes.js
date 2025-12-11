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

// POST /api/auth/register
router.post('/register', celebrate(registerUserSchema), registerUser);

// POST /api/auth/login
router.post('/login', celebrate(loginUserSchema), loginUser);

// POST /api/auth/logout
router.post('/logout', logoutUser);

// POST /api/auth/refresh
router.post('/refresh', refreshSession);

// GET /api/auth/me
router.get('/me', authenticate, getCurrentUser);

export default router;
