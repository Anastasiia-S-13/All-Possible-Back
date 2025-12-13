

import { Schema, model } from "mongoose";





const toolSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    pricePerDay: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    specifications: { type: Object, default: {} },
    rentalTerms: { type: String, default: "" },
    bookedDates: [{ type: Date }],
    feedbacks: [{ type: Schema.Types.ObjectId, ref: "Feedback" }],
  },
  { timestamps: true }
);

export const Tool = model("Tool", toolSchema);


// =======

// import mongoose from 'mongoose';

// const { Schema, model } = mongoose;

// const toolSchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   pricePerDay: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
//   description: {
//     type: String,
//     trim: true,
//   },
//   category: {
//     type: Schema.Types.ObjectId,
//     ref: 'Category',
//     required: true,
//   },
//   owner: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   images: {
//     type: String,
//     trim: true,
//   },
//   rating: {
//     type: Number,
//     min: 0,
//     max: 5,
//     default: 0,
//   },
//   specifications: {
//     type: Map,
//     of: String,
//   },
//   rentalTerms: {
//     type: String,
//     trim: true,
//   },
//   bookedDates: [{
//     startDate: {
//       type: Date,
//       required: true,
//     },
//     endDate: {
//       type: Date,
//       required: true,
//     },
//     _id: false,
//   }],
//   feedbacks: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Feedback',
//   }],
// }, {
//   timestamps: true,
// });


// export const Tool = model('Tool', toolSchema);
// >>>>>>> main
