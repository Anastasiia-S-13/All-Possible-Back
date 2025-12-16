import createHttpError from 'http-errors';
import { Tool } from '../models/tool.js';
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

export const getToolById = async (req, res, next) => {
  const { id } = req.params;

  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return next(createHttpError(400, 'Invalid tool id'));
  }

  const tool = await Tool.findById(id);

  if (!tool) {
    return next(createHttpError(404, 'Tool not found'));
  }

  res.status(200).json(tool);
};


export const deleteTool = async (req, res, next) => {
  const { id: toolId } = req.params;

  const tool = await Tool.findById(toolId);
  if (!tool) {
    return next(createHttpError(404, 'Tool not found'));
  }

  if (tool.owner.toString() !== req.user._id.toString()) {
    return next(createHttpError(403, 'Forbidden: not the owner'));
  }

  await tool.deleteOne();

  res.status(200).json({ message: 'Tool deleted successfully' });
};


export const createTool = async (req, res) => {
if(!req.file) {
  throw createHttpError(400, "Image is required");
}
const result = await saveFileToCloudinary(req.file.buffer);
    const tool = await Tool.create({
      ...req.body,
      owner: req.user._id,
      images: result.secure_url,
    });

    res.status(201).json(tool);

};



export const getTools = async (req, res) => {
  const { page = 1, perPage = 10, category, search } = req.query;
  const skip = (page - 1) * perPage;

  const toolsQuery = Tool.find();

  if (category) {
    const categories = category.split(",");
    toolsQuery.where("category").in(categories);
  }

  if (search) {
    toolsQuery.where("name").regex(new RegExp(search, "i"));
  }

  const [totalTools, tools] = await Promise.all([
    toolsQuery.clone().countDocuments(),
    toolsQuery.skip(skip).limit(perPage).sort({ createdAt: -1 }),
  ]);

  const totalPages = Math.ceil(totalTools / perPage);

  res.status(200).json({
    page,
    perPage,
    totalTools,
    totalPages,
    tools,
  });
};


