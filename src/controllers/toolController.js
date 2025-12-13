import mongoose from "mongoose";
import { Tool } from "../models/tool.js";



export const getToolById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Перевірка валідності ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const tool = await Tool.findById(id);

    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    return res.status(200).json(tool);
  } catch (error) {
    next(error);
  }
};
