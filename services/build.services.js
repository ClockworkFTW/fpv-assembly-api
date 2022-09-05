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
    attributes: ["id", "partId", "quantity"],
  });

  const parts = await Promise.all(
    buildParts.map(async ({ id, partId, quantity }) => {
      const part = await partServices.getPartById(partId);
      return { ...part, buildPart: { id, quantity } };
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
 * @param {string} username
 * @return {object} build
 */
const initBuild = async (userId) => {
  let build = await models.Build.findOne({
    where: { userId, isPublished: false },
  });

  if (!build) {
    build = await models.Build.create({ userId });
  }

  return await getBuildById(build.id);
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

export default {
  initBuild,
  queryBuilds,
  getBuildById,
  updateBuildById,
  deleteBuildById,
};
