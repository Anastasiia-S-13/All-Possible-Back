import { Schema, model } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    content: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 5000,
    }
  },
  { timestamps: true }
);


export const Note = model("Note", noteSchema);
