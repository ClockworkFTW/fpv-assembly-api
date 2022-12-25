import { models } from "../config/postgres.js";
import partServices from "./part.services.js";

/**
 * Get build by ID
 *
 * @param {String} buildId
 * @return {Promise<Object>} build
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

  const buildImages = await models.BuildImage.findAll({
    where: { buildId },
    attributes: ["imageId", "index"],
  });

  const images = await Promise.all(
    buildImages.map(async ({ imageId, index }) => {
      const image = await models.Image.findByPk(imageId, {
        attributes: ["id", "url"],
        raw: true,
      });
      return { ...image, index };
    })
  );

  return { ...build, user, parts, images };
};

/**
 * Query builds
 *
 * @param {Object} config
 * @return {Promise<Array>} builds
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

export default { queryBuilds, getBuildById };
