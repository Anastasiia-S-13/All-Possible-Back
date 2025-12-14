import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  if (!req.cookies.accessToken) {
    return next(createHttpError(401, 'Missing access token'));
  }

  const session = await Session.findOne({
    accessToken: req.cookies.accessToken,
  });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  const accessTokenVerification =
    new Date() > new Date(session.accessTokenValidUntil);

  if (accessTokenVerification) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await User.findById(session.userId);

  if (!user) {
    await Session.findByIdAndDelete(session._id);
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;

  next();
};
