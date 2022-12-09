import dayjs from "dayjs";
import { v5 as uuidv5 } from "uuid";
import asyncHandler from "express-async-handler";
import partServices from "../services/part.services.js";
import { models } from "../config/postgres.js";
import config from "../config/variables.js";

/**
 * Get parts
 */
const getParts = asyncHandler(async (req, res) => {
  const { type, page, sort, ...rest } = req.query;

  // Parse url query parameters
  const query = Object.entries(rest).reduce(
    (query, [key, val]) => ({ ...query, [key]: JSON.parse(val) }),
    {}
  );

  // Define database query parameters
  const limit = 50;
  const offset = limit * (page - 1);

  const where = {
    ...partServices.initWhere("part", query),
    type,
  };

  const include = {
    model: models[partServices.partTypeToModel(type)],
    where: partServices.initWhere(type, query),
  };

  const order = partServices.initOrder(type, sort);

  // Get parts from database
  const parts = await models.Part.findAll({
    limit,
    offset,
    where,
    include,
    order,
  });

  // Initialize part filters
  const metaFilter = await partServices.initPartsModelFilter("part", query);
  const specFilter = await partServices.initPartsModelFilter(type, query);

  // Build filter object
  const filter = {
    ...metaFilter,
    ...specFilter,
  };

  // Get total part count
  const { count } = await models.Part.findAndCountAll({ where, include });

  // Build pagination object
  const pagination = {
    count: Math.ceil(count / limit),
    page: Number(page),
  };

  res.status(200).send({ parts, filter, pagination });
});

/**
 * Get part
 */
const getPart = asyncHandler(async (req, res) => {
  const { partId } = req.params;

  let part = await partServices.getPartById(partId);

  const listings = await partServices.getPartListingsById(partId);
  const reviews = await partServices.getPartReviewsById(partId);

  part = { ...part, listings, reviews };

  res.status(200).send({ part });
});

/**
 * Create part
 */
const createPart = asyncHandler(async (req, res) => {
  const { metaData, specData, listings } = req.body;

  // Create part meta data
  const partMeta = await models.Part.create(metaData);
  const partId = partMeta.id;

  // Create part specification data
  const model = partServices.partTypeToModel(metaData.type);
  await models[model].create({ ...specData, partId });

  // Create part listings
  await Promise.all(
    listings.map(async ({ vendor, link, price }) => {
      const listing = await models.Listing.create({ vendor, link, partId });

      // Create initial part price
      const value = price;
      const listingId = listing.id;
      const date = dayjs().format("YYYY-MM-DD");
      const id = uuidv5(`${listingId}${date}${vendor}`, config.namespace);

      await models.Price.create({ id, value, date, listingId });
    })
  );

  // Return formatted part
  const part = await partServices.getPartById(partId);

  res.status(201).send({ part });
});

/**
 * Update part
 */
const updatePart = asyncHandler(async (req, res) => {
  const { partId } = req.params;
  const { metaData, specData } = req.body;

  const partMeta = await models.Part.findByPk(partId);

  if (!partMeta) {
    throw new Error("Part not found");
  }

  const model = partServices.partTypeToModel(partMeta.type);
  const partSpec = await models[model].findOne({ where: { partId } });

  if (!partSpec) {
    throw new Error("Part not found");
  }

  await partMeta.update(metaData);
  await partSpec.update(specData);

  const part = await partServices.getPartById(partId);

  res.status(200).send({ part });
});

/**
 * Delete part
 */
const deletePart = asyncHandler(async (req, res) => {
  const { partId } = req.params;

  const partMeta = await models.Part.findByPk(partId);

  if (!partMeta) {
    throw new Error("Part not found");
  }

  const model = partServices.partTypeToModel(partMeta.type);
  const partSpec = await models[model].findOne({ where: { partId } });

  if (!partSpec) {
    throw new Error("Part not found");
  }

  await partMeta.destroy();
  await partSpec.destroy();

  res.status(204).end();
});

/**
 * Create part review
 */
const createPartReview = asyncHandler(async (req, res) => {
  const { userId } = req.auth;
  const { partId } = req.params;
  const { message, rating } = req.body;

  await models.Review.create({ message, rating, partId, userId });

  await partServices.updatePartRating(partId);

  const part = await partServices.getPartById(partId);

  res.status(201).send({ part });
});

/**
 * Update part review
 */
const updatePartReview = asyncHandler(async (req, res) => {
  const { partId, reviewId } = req.params;
  const { message, rating } = req.body;

  const review = await models.Review.findByPk(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  await review.update({ message, rating });

  await partServices.updatePartRating(partId);

  const part = await partServices.getPartById(partId);

  res.status(200).send({ part });
});

/**
 * Delete part review
 */
const deletePartReview = asyncHandler(async (req, res) => {
  const { partId, reviewId } = req.params;

  const review = await models.Review.findByPk(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  await review.destroy();

  await partServices.updatePartRating(partId);

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
