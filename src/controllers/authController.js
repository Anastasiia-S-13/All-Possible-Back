import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import {
  createSession,
  setSessionCookies,
  clearSessionCookies,
} from '../services/auth.js';

export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(createHttpError(400, 'Користувач з таким email вже існує'));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();

  const session = await createSession(user._id.toString());
  setSessionCookies(res, session);

  res.status(201).json({
    user: user.toJSON(),
  });
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(createHttpError(401, 'Невірний email або пароль'));
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
};

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.findByIdAndDelete(sessionId);
  }

  clearSessionCookies(res);

  res.status(204).send();
};

export const refreshSession = async (req, res, next) => {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    return next(createHttpError(401, 'Session not found'));
  }

  const session = await Session.findById(sessionId);
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    return next(createHttpError(401, 'Invalid refresh token'));
  }

  if (new Date() > session.refreshTokenValidUntil) {
    return next(createHttpError(401, 'Refresh token expired'));
  }

  await Session.findByIdAndDelete(sessionId);

  const newSession = await createSession(session.userId.toString());
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: 'Session refreshed successfully',
  });
};
