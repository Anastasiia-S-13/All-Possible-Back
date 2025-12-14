import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const bookingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  toolId: {
    type: Schema.Types.ObjectId,
    ref: 'Tool',
    required: true,
    index: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  deliveryCity: {
    type: String,
    required: true,
    trim: true,
  },
  novaPoshtaBranch: {
    type: String,
    required: true,
    trim: true,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

bookingSchema.index({ toolId: 1, startDate: 1, endDate: 1 });

export const Booking = model('Booking', bookingSchema);
