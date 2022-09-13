import asyncHandler from "express-async-handler";
import partServices from "../services/part.services.js";

/**
 * Get parts
 */
const getParts = asyncHandler(async (req, res) => {
  const parts = await partServices.queryParts();

  res.status(200).send({ parts });
});

/**
 * Get part
 */
const getPart = asyncHandler(async (req, res) => {
  const { partId } = req.params;

  const part = await partServices.getPartById(partId);

  res.status(200).send({ part });
});

/**
 * Create part
 */
const createPart = asyncHandler(async (req, res) => {
  const partId = await partServices.createPart(req.body);
  const part = await partServices.getPartById(partId);

  res.status(201).send({ part });
});

/**
 * Update part
 */
const updatePart = asyncHandler(async (req, res) => {
  const { partId } = req.params;

  await partServices.updatePartById(partId, req.body);
  const part = await partServices.getPartById(partId);

  res.status(200).send({ part });
});

/**
 * Delete part
 */
const deletePart = asyncHandler(async (req, res) => {
  const { partId } = req.params;

  await partServices.deletePartById(partId);

  res.status(204).end();
});

/**
 * Create part review
 */
const createPartReview = asyncHandler(async (req, res) => {
  const { partId } = req.params;
  const userId = req.user.id;

  await partServices.createPartReview({ ...req.body, partId, userId });
  const part = await partServices.getPartById(partId);

  res.status(201).send({ part });
});

/**
 * Update part review
 */
const updatePartReview = asyncHandler(async (req, res) => {
  const { partId, reviewId } = req.params;

  await partServices.updatePartReviewById(reviewId, req.body);
  const part = await partServices.getPartById(partId);

  res.status(200).send({ part });
});

/**
 * Delete part review
 */
const deletePartReview = asyncHandler(async (req, res) => {
  const { partId, reviewId } = req.params;

  await partServices.deletePartReviewById(reviewId);
  const part = await partServices.getPartById(partId);

  res.status(200).send({ part });
});

export default {
  getParts,
  getPart,
  createPart,
  updatePart,
  deletePart,
  createPartReview,
  updatePartReview,
  deletePartReview,
};
