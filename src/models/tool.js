
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const toolSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  pricePerDay: {
    type: Number,
    required: true,
    min: 0,
  },
  images: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  specifications: {
    type: Map,
    of: String,
  },
  rentalTerms: {
    type: String,
    default: "",
  },
  bookedDates: [{
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    _id: false,
  }],
  feedbacks: [{
    type: Schema.Types.ObjectId,
    ref: 'Feedback',
  }],
}, {
  timestamps: true,
});




export const Tool = mongoose.models.Tool || model('Tool', toolSchema);
