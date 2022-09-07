import { models } from "../config/postgres.js";

/**
 * Converts part type to model name
 * @param {string} partType
 * @return {string} model name
 */
export const partTypeToModel = (partType) => {
  let words = partType.split(" ");
  words = words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
  return words.join("");
};

/**
 * Get part by ID
 * @param {string} partId
 * @return {object} part
 */
const getPartById = async (partId) => {
  const partMeta = await models.Part.findByPk(partId, {
    raw: true,
  });

  const model = partTypeToModel(partMeta.type);

  const partSpecs = await models[model].findOne({
    attributes: { exclude: ["id", "partId", "createdAt", "updatedAt"] },
    where: { partId },
    raw: true,
  });

  const reviews = await models.Review.findAll({
    include: { model: models.User, attributes: ["id", "username"] },
    attributes: { exclude: ["partId", "userId"] },
    where: { partId },
    nest: true,
    raw: true,
  });

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return { ...partMeta, ...partSpecs, reviews, averageRating };
};

/**
 * Query parts
 * @param {object} config
 * @return {object} part
 */
const queryParts = async (config = {}) => {
  const parts = await models.Part.findAll({
    ...config,
    attributes: ["id"],
    raw: true,
  });

  return await Promise.all(
    parts.map(async (part) => {
      return await getPartById(part.id);
    })
  );
};

/**
 * Create part
 * @param {object} body
 * @return {string} partId
 */
const createPart = async (body) => {
  const { partMeta, partSpecs } = body;

  const part = await models.Part.create(partMeta);
  const partId = part.get("id");

  const model = partTypeToModel(partMeta.type);
  await models[model].create({ ...partSpecs, partId });

  return partId;
};

/**
 * Update part by ID
 * @param {string} partId
 * @param {object} body
 */
const updatePartById = async (partId, body) => {
  const { partMeta, partSpecs } = body;

  await models.Part.update(partMeta, { where: { id: partId } });

  const model = partTypeToModel(partMeta.type);
  await models[model].update(partSpecs, { where: { partId } });
};

/**
 * Delete part by ID
 * @param {string} partId
 */
const deletePartById = async (partId) => {
  await models.Part.destroy({ where: { id: partId } });
};

/**
 * Create part review
 * @param {object} body
 */
const createPartReview = async (body) => {
  await models.Review.create(body);
};

/**
 * Update part review by ID
 * @param {string} reviewId
 * @param {object} body
 */
const updatePartReviewById = async (reviewId, body) => {
  await models.Review.update(body, { where: { id: reviewId } });
};

/**
 * Delete part review by ID
 * @param {string} reviewId
 */
const deletePartReviewById = async (reviewId) => {
  await models.Review.destroy({ where: { id: reviewId } });
};

export default {
  partTypeToModel,
  getPartById,
  queryParts,
  createPart,
  updatePartById,
  deletePartById,
  createPartReview,
  updatePartReviewById,
  deletePartReviewById,
};
