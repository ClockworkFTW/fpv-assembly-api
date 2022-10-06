import { models } from "../config/postgres.js";

/**
 * Converts part type to model name
 *
 * @param {String} partType
 * @return {String} model name
 */
export const partTypeToModel = (partType) => {
  let words = partType.split("-");
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

  const rating = await getPartRatingById(partId);
  const price = await getPartPriceById(partId);

  return { ...partMeta, ...partSpecs, price, rating };
};

/**
 * Get part price
 *
 * @param {String} partId
 * @return {Promise<Number>} price
 */
const getPartPriceById = async (partId) => {
  const listingIds = await models.Listing.findAll({
    where: { partId },
    attributes: ["id"],
    raw: true,
  });

  const prices = await Promise.all(
    listingIds.map(async ({ id }) => {
      const { value } = await models.Price.findOne({
        where: { listingId: id },
        order: [["date", "DESC"]],
        attributes: ["value"],
        raw: true,
      });
      return value;
    })
  );

  return Math.min(...prices);
};

/**
 * Get part rating
 *
 * @param {String} partId
 * @return {Promise<Object>} rating
 */
const getPartRatingById = async (partId) => {
  const reviews = await getPartReviewsById(partId);

  const count = reviews.length;
  const value = reviews.reduce((sum, { rating }) => sum + rating, 0) / count;

  return { count, value };
};

/**
 * Get part listings
 *
 * @param {String} partId
 * @return {Promise<Array>} listings
 */
const getPartListingsById = async (partId) => {
  let listings = await models.Listing.findAll({
    include: {
      model: models.Price,
      attributes: ["value", "date"],
      order: [["date", "DESC"]],
      separate: true,
    },
    attributes: ["vendor", "link"],
    where: { partId },
    nest: true,
  });

  listings = listings.map((listing) => {
    const { prices, ...rest } = listing.toJSON();
    const currentPrice = prices[0].value;
    return { ...rest, currentPrice, priceHistory: prices };
  });

  return listings;
};

/**
 * Get part reviews
 *
 * @param {String} partId
 * @return {Promise<Array>} reviews
 */
const getPartReviewsById = async (partId) => {
  const reviews = await models.Review.findAll({
    include: { model: models.User, attributes: ["id", "username"] },
    attributes: { exclude: ["partId", "userId"] },
    where: { partId },
    nest: true,
  });

  return reviews.map((review) => review.toJSON());
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
  getPartListingsById,
  getPartReviewsById,
  queryParts,
};
