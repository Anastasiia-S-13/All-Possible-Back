import { Schema, model } from "mongoose";

const toolSchema = new Schema(
  {
    title: { type: String, required: true },
    pricePerDay: { type: Number, required: true },

    description: { type: String },

    specs: {
      type: Map,
      of: String,
    },

    images: [String],
  },
  { timestamps: true }
);

export const Tool = model("Tool", toolSchema);
