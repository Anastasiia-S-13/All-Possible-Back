import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies, clearSessionCookies } from '../services/auth.js';

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw createHttpError(400, 'Користувач з таким email вже існує');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await user.save();

    const session = await createSession(user._id.toString());
    setSessionCookies(res, session);

    res.status(201).json({
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw createHttpError(401, 'Невірний email або пароль');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createHttpError(401, 'Невірний email або пароль');
    }

    await Session.deleteMany({ userId: user._id });

    const session = await createSession(user._id.toString());
    setSessionCookies(res, session);

    res.status(200).json({
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    if (sessionId) {
      await Session.findByIdAndDelete(sessionId);
    }

    clearSessionCookies(res);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const refreshSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    if (!sessionId || !refreshToken) {
      throw createHttpError(401, 'Session not found');
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    if (session.refreshToken !== refreshToken) {
      throw createHttpError(401, 'Invalid refresh token');
    }

    if (new Date() > session.refreshTokenValidUntil) {
      throw createHttpError(401, 'Refresh token expired');
    }

    await Session.findByIdAndDelete(sessionId);

    const newSession = await createSession(session.userId.toString());
    setSessionCookies(res, newSession);

    res.status(200).json({
      message: 'Session refreshed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      throw createHttpError(401, 'Not authenticated');
    }

    res.json({
      user: req.user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};
