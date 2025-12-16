import createHttpError from 'http-errors';

export const getCurrentUser = async (req, res, next) => {
  if (!req.user) {
    return next(createHttpError(401, 'Not authenticated'));
  }

  res.status(200).json(req.user);
};
