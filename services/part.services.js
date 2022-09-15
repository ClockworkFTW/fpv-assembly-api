import { models } from "../config/postgres.js";

/**
 * Converts part type to model name
 *
 * @param {String} partType
 * @return {String} model name
 */
export const partTypeToModel = (partType) => {
  let words = partType.split(" ");
  words = words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
  return words.join("");
};

/**
 * Get part by ID
 *
 * @param {String} partId
 * @return {Promise<Object>} part
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
 *
 * @param {Object} config
 * @return {Promise<Array>} part
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

export default {
  partTypeToModel,
  getPartById,
  queryParts,
};
