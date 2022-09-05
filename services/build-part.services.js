import { models } from "../config/postgres.js";
import buildServices from "./build.services.js";

/**
 * Create build part
 * @param {string} buildId
 * @param {string} partId
 * @return {object} build
 */
const createBuildPart = async (buildId, partId) => {
  const buildPart = await models.BuildPart.create({ buildId, partId });
  return await buildServices.getBuildById(buildPart.buildId);
};

/**
 * Update build part by ID
 * @param {string} buildPartId
 * @param {integer} quantity
 * @return {object} build
 */
const updateBuildPartById = async (buildPartId, quantity) => {
  const buildPart = await models.BuildPart.findByPk(buildPartId);
  await buildPart.update({ quantity });
  return buildServices.getBuildById(buildPart.buildId);
};

/**
 * Delete build part by ID
 * @param {string} buildPartId
 * @return {object} build
 */
const deleteBuildPartById = async (buildPartId) => {
  const buildPart = await models.BuildPart.findByPk(buildPartId);
  await buildPart.destroy();
  return buildServices.getBuildById(buildPart.buildId);
};

export default {
  createBuildPart,
  updateBuildPartById,
  deleteBuildPartById,
};
