import createHttpError from "http-errors";
import { Booking } from "../models/booking.js";
import { Tool } from "../models/tool.js";


const datesOverlap = (start1, end1, start2, end2) => {
  return start1 <= end2 && start2 <= end1;
};
//розрахунок доби
const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 0 ? 1 : diffDays;
};


export const checkAvailability = async (req, res, next) => {

  const { toolId } = req.params;

  const tool = await Tool.findById(toolId);
  if (!tool) {
    return next(createHttpError(404, "Інструмент не знайдено"));
  }

  return res.status(200).json({
    success: true,
    bookedPeriods: tool.bookedDates,
  });
};
//контроллер для бронювання
export const createBooking = async (req, res, next) => {

  const {
    toolId,
    firstName,
    lastName,
    phone,
    startDate,
    endDate,
    deliveryCity,
    novaPoshtaBranch,
  } = req.body;


  const userId = req.userId;

  const tool = await Tool.findById(toolId);
  if (!tool) {
    return next(createHttpError(404, "Інструмент не знайдено"));
  }

  const requestedStart = new Date(startDate);
  const requestedEnd = new Date(endDate);

  const hasOverlap = tool.bookedDates.some(period =>
    datesOverlap(
      requestedStart,
      requestedEnd,
      new Date(period.startDate),
      new Date(period.endDate)
    )
  );

  if (hasOverlap) {
    return next(createHttpError(409, "Інструмент більше не доступний для вибраних дат"));
  }

  const days = calculateDays(requestedStart, requestedEnd);
  const totalPrice = days * tool.pricePerDay;

  if (isNaN(totalPrice) || !isFinite(totalPrice) || totalPrice < 0) {
    return next(createHttpError(400, "Недійсний розрахунок загальної ціни"));
  }

  const booking = new Booking({
    userId,
    toolId,
    firstName,
    lastName,
    phone,
    startDate: requestedStart,
    endDate: requestedEnd,
    deliveryCity,
    novaPoshtaBranch,
    totalPrice,
    status: "pending",
  });

  await booking.save();

  tool.bookedDates.push({
    startDate: requestedStart,
    endDate: requestedEnd,
  });
  await tool.save();

  await booking.populate("toolId", "name pricePerDay");

  return res.status(201).json({
    success: true,
    message: "Успішне бронювання",
    booked: {
      id: booking._id,
      userId: booking.userId,
      tool: {
        id: booking.toolId._id,
        name: booking.toolId.name,
        pricePerDay: booking.toolId.pricePerDay,
      },
      customerInfo: {
        firstName: booking.firstName,
        lastName: booking.lastName,
        phone: booking.phone,
      },
      rentalPeriod: {
        startDate: booking.startDate,
        endDate: booking.endDate,
        days,
      },
      delivery: {
        city: booking.deliveryCity,
        branch: booking.novaPoshtaBranch,
      },
      totalPrice: booking.totalPrice,
      status: booking.status,
      createdAt: booking.createdAt,
    },
  });
};
