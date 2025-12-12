import { Feedback } from '../models/feedback.js';

export const getAllFeedbacks = async (req, res) => {
  const { page = 1, perPage = 3 } = req.query;
  const skip = (page - 1) * perPage;

  const feedbacksQuery = Feedback.find();

  const [totalFeedbacks, feedbacks] = await Promise.all([
    feedbacksQuery.clone().countDocuments(),
    feedbacksQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalFeedbacks / perPage);
  res
    .status(200)
    .json({ page, perPage, totalFeedbacks, totalPages, feedbacks });
};
