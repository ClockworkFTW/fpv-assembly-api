import buildServices from "../services/build.services.js";
import catchAsync from "../util/catch-async.js";

/**
 * Get builds
 */
const getBuilds = catchAsync(async (req, res) => {
  const builds = await buildServices.queryBuilds();

  res.status(200).send({ builds });
});

/**
 * Get build
 */
const getBuild = catchAsync(async (req, res) => {
  const { buildId } = req.params;

  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

/**
 * Create build
 */
const createBuild = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const buildId = await buildServices.initBuild(userId);
  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

/**
 * Update build
 */
const updateBuild = catchAsync(async (req, res) => {
  const { buildId } = req.params;

  await buildServices.updateBuildById(buildId, req.body);
  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

/**
 * Delete build
 */
const deleteBuild = catchAsync(async (req, res) => {
  const { buildId } = req.params;

  await buildServices.deleteBuildById(buildId);

  res.status(200).end();
});

/**
 * Create build part
 */
const createBuildPart = catchAsync(async (req, res) => {
  const { buildId, partId } = req.params;

  await buildServices.createBuildPart(buildId, partId);
  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

/**
 * Update build part
 */
const updateBuildPart = catchAsync(async (req, res) => {
  const { buildId, partId } = req.params;
  const { quantity } = req.body;

  await buildServices.updateBuildPartById(buildId, partId, quantity);
  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

/**
 * Delete build part
 */
const deleteBuildPart = catchAsync(async (req, res) => {
  const { buildId, partId } = req.params;

  await buildServices.deleteBuildPartById(buildId, partId);
  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

/**
 * Create build image
 */
const createBuildImage = catchAsync(async (req, res) => {
  const { buildId } = req.params;

  await buildServices.createBuildImage(buildId, req.file);
  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

/**
 * Delete build image
 */
const deleteBuildImage = catchAsync(async (req, res) => {
  const { buildId, imageId } = req.params;

  await buildServices.deleteBuildImageById(imageId);
  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

export default {
  getBuilds,
  getBuild,
  createBuild,
  updateBuild,
  deleteBuild,
  createBuildPart,
  updateBuildPart,
  deleteBuildPart,
  createBuildImage,
  deleteBuildImage,
};
