import { models } from "../config/postgres.js";
import partServices from "./part.services.js";

/**
 * Get build by ID
 * @param {string} buildId
 * @return {object} build
 */
const getBuildById = async (buildId) => {
  const { userId, ...build } = await models.Build.findByPk(buildId, {
    raw: true,
  });

  const user = await models.User.findByPk(userId, {
    attributes: ["id", "username"],
    raw: true,
  });

  const buildParts = await models.BuildPart.findAll({
    where: { buildId },
    attributes: ["partId", "quantity"],
  });

  const parts = await Promise.all(
    buildParts.map(async ({ partId, quantity }) => {
      const part = await partServices.getPartById(partId);
      return { ...part, quantity };
    })
  );

  return { ...build, user, parts };
};

/**
 * Query builds
 * @param {object} config
 * @return {object} builds
 */
const queryBuilds = async (config = {}) => {
  const builds = await models.Build.findAll({
    ...config,
    attributes: ["id"],
    raw: true,
  });

  return await Promise.all(
    builds.map(async (build) => {
      return await getBuildById(build.id);
    })
  );
};

/**
 * Initialize build
 * @param {string} userId
 * @return {string} buildId
 */
const initBuild = async (userId) => {
  const [build, created] = await models.Build.findOrCreate({
    where: { userId, isPublished: false },
    raw: true,
  });
  return build.id;
};

/**
 * Update build by ID
 * @param {string} buildId
 * @param {object} body
 * @return {object} build
 */
const updateBuildById = async (buildId, body) => {
  await models.Build.update(body, { where: { id: buildId } });
  return await getBuildById(buildId);
};

/**
 * Delete build by ID
 * @param {string} buildId build id
 */
const deleteBuildById = async (buildId) => {
  await models.Build.destroy({ where: { id: buildId } });
};

/**
 * Create build part
 * @param {string} buildId
 * @param {string} partId
 */
const createBuildPart = async (buildId, partId) => {
  await models.BuildPart.create({ buildId, partId });
};

/**
 * Update build part by ID
 * @param {string} buildId
 * @param {string} partId
 * @param {integer} quantity
 */
const updateBuildPartById = async (buildId, partId, quantity) => {
  await models.BuildPart.update({ quantity }, { where: { buildId, partId } });
};

/**
 * Delete build part by ID
 * @param {string} buildId
 * @param {string} partId
 */
const deleteBuildPartById = async (buildId, partId) => {
  await models.BuildPart.destroy({ where: { buildId, partId } });
};

export default {
  initBuild,
  queryBuilds,
  getBuildById,
  updateBuildById,
  deleteBuildById,
  createBuildPart,
  updateBuildPartById,
  deleteBuildPartById,
};
