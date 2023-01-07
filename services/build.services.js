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

  const comments = await getComments(buildId);

  return { ...build, user, parts, images, comments };
};

const getComments = async (buildId) => {
  // Get parent comments
  const parents = await models.Comment.findAll({
    where: { buildId, parentId: null },
    include: { model: models.User, attributes: ["id", "username"] },
    attributes: { exclude: ["buildId", "userId"] },
    nest: true,
    raw: true,
  });

  const getChildren = async (parent) => {
    // Get child id's
    const childIds = await models.CommentChild.findAll({
      where: { commentId: parent.id },
      attributes: ["childId"],
      raw: true,
    });

    // Get children recursively
    const children = await Promise.all(
      childIds.map(async ({ childId }) => {
        // Get child
        const child = await models.Comment.findByPk(childId, {
          include: { model: models.User, attributes: ["id", "username"] },
          attributes: { exclude: ["buildId", "userId"] },
          nest: true,
          raw: true,
        });

        // Get votes
        const votes = await models.CommentVote.findAll({
          where: { commentId: child.id },
          attributes: ["userId", "vote"],
        });

        return await getChildren({ ...child, votes });
      })
    );

    // Return parent object with children
    return { ...parent, children };
  };

  // Recursively get all child comments
  return await Promise.all(
    parents.map(async (parent) => {
      // Get votes
      const votes = await models.CommentVote.findAll({
        where: { commentId: parent.id },
        attributes: ["userId", "vote"],
      });

      return await getChildren({ ...parent, votes });
    })
  );
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
