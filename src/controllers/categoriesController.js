import { Category } from '../models/category.js';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories.length <= 0) {
      return res.status(400).json({ error: 'Not found categories' });
    }
    res.status(200).json(categories);
  } catch {
    return res.status(500).json('Server error while fetching categories');
  }
};
