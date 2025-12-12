import createHttpError from 'http-errors';
import { User } from '../models/user.js';

export const getPublicUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('name avatar createdAt');

    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
