import { models } from "../config/postgres.js";

/**
 * Converts part type to model name
 * @param {string} partType
 * @return {string} model name
 */
export const typeToModel = (partType) => {
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

  const partSpecs = await models[typeToModel(partMeta.type)].findOne({
    attributes: { exclude: ["id", "partId", "createdAt", "updatedAt"] },
    where: { partId },
    raw: true,
  });

  return { ...partMeta, ...partSpecs };
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
 * @return {object} part
 */
const createPart = async (body) => {
  const { type, name, manufacturer, image, weight, ...partSpecs } = body;

  let part = await models.Part.create({
    type,
    name,
    manufacturer,
    image,
    weight,
  });

  await models[typeToModel(type)].create({
    ...partSpecs,
    partId: part.id,
  });

  return await getPartById(part.id);
};

/**
 * Update part by ID
 * @param {string} partId
 * @param {object} body
 * @return {object} part
 */
const updatePartById = async (partId, body) => {
  const { type, name, manufacturer, image, weight, ...partSpecs } = body;

  await req.models.Part.update(
    {
      type,
      name,
      manufacturer,
      image,
      weight,
    },
    { where: { id: partId } }
  );

  await req.models[partServices.typeToModel(type)].update(
    { partSpecs },
    { where: { partId } }
  );

  return await getPartById(partId);
};

/**
 * Delete part by ID
 * @param {string} partId
 */
const deletePartById = async (partId) => {
  await req.models.Part.destroy({ where: { id: partId } });
};

export default {
  typeToModel,
  getPartById,
  queryParts,
  createPart,
  updatePartById,
  deletePartById,
};
