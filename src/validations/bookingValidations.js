import { Joi, Segments } from 'celebrate';

const requiredInput = `Це поле є обов'язковим`;
const requiredStartData = `Початкова дата є обов'язковою`;
const requiredEndData = `Кінцева дата є обов'язковою`;

const sanitizePhone = (value, helpers) => {
  const sanitized = value.replace(/[^\d+]/g, "");

  if (!/^\+?[0-9]{10,15}$/.test(sanitized)) {
    return helpers.error("string.pattern.base");
  }

  return sanitized;
};


export const createBookingSchema = {
  [Segments.BODY]: Joi.object({
    toolId: Joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Invalid Tool ID format',
        'any.required': 'Tool ID is required',
      }),

    firstName: Joi.string()
      .trim()
      .min(3)
      .max(50)
      .required()
      .messages({
        'string.min': `Ім'я має містити принаймні 3 символи`,
        'string.max': `Ім'я не може перевищувати 20 символів`,
        'any.required': requiredInput,
      }),

    lastName: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': 'Прізвище має містити принаймні 3 символи',
        'string.max': 'Прізвище не може перевищувати 30 символів',
        'any.required': requiredInput,
      }),

    phone: Joi.string()
      .trim()
      .custom(sanitizePhone)
      .required()
      .messages({
        'string.pattern.base': 'Невірний формат номера телефону. Укажіть дійсний номер телефону.',
        'any.required': requiredInput,
      }),

    startDate: Joi.date()
      .iso()
      .min('now')
      .required()
      .messages({
        'date.min': 'Start date must be in the future',
        'any.required': requiredStartData,
        'date.base': 'Invalid start date format',
      }),

    endDate: Joi.date()
      .iso()
      .greater(Joi.ref('startDate'))
      .required()
      .messages({
        'date.greater': 'End date must be after start date',
        'any.required': requiredEndData,
        'date.base': 'Invalid end date format',
      }),

    deliveryCity: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'Місто доставки має містити принаймні 3 символи',
        'string.max': 'Місто доставки не може перевищувати 100 символів',
        'any.required': requiredInput,
      }),

    novaPoshtaBranch: Joi.string()
      .trim()
      .min(2)
      .max(200)
      .required()
      .messages({
        'string.min': 'Відділення Нової Пошти має містити принаймні 3 символи',
        'string.max': 'Відділення Нової Пошти не може перевищувати 200 символів',
        'any.required': requiredInput,
      }),
  })
};


export const checkAvailabilitySchema = Joi.object({
  toolId: Joi.string().hex().length(24).required()

});
