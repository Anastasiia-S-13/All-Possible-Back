import { Joi, Segments } from 'celebrate';

export const createToolSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(3).max(96).required(),
    pricePerDay: Joi.number().min(0).required(),
    category: Joi.string().hex().length(24).required(),
    description: Joi.string().min(20).max(2000).required(),
    rentalTerms: Joi.string().min(20).max(1000).required(),
    specifications: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  }),
};

export const getToolsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).default(10),
    category: Joi.string().allow(''),
    search: Joi.string().allow(''),
  }),
};
