import buildServices from "../services/build.services.js";

/**
 * Get builds
 */
const getBuilds = async (req, res) => {
  const builds = await buildServices.queryBuilds();

  res.status(200).send({ builds });
};

/**
 * Get build
 */
const getBuild = async (req, res) => {
  const { buildId } = req.params;

  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
};

/**
 * Create build
 */
const createBuild = async (req, res) => {
  const userId = req.user.id;

  const build = await buildServices.initBuild(userId);

  res.status(200).send({ build });
};

/**
 * Update build
 */
const updateBuild = async (req, res) => {
  const { buildId } = req.params;

  const build = await buildServices.updateBuildById(buildId, req.body);

  res.status(200).send({ build });
};

/**
 * Delete build
 */
const deleteBuild = async (req, res) => {
  const { buildId } = req.params;

  await buildServices.deleteBuildById(buildId);

  res.status(200).end();
};

export default {
  getBuilds,
  getBuild,
  createBuild,
  updateBuild,
  deleteBuild,
};
