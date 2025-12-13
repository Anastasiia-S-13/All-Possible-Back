import { Joi, Segments } from "celebrate";


export const createToolSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(3).max(96).required(),
    pricePerDay: Joi.number().min(0).required(),
    categoryId: Joi.string().required(),
    description: Joi.string().min(20).max(2000).required(),
    terms: Joi.string().min(20).max(1000).required(),
    specifications: Joi.string().max(1000).optional(),
  })
};



export const getToolsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).default(10),
    category: Joi.string().allow(""),
    search: Joi.string().allow(""),
  }),
};
