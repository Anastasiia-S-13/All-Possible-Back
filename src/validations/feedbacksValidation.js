import { Joi, Segments } from 'celebrate';

export const getAllFeedbacksSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(3).default(3),
  }),
};
