import asyncHandler from "express-async-handler";
import buildServices from "../services/build.services.js";

/**
 * Get builds
 */
const getBuilds = asyncHandler(async (req, res) => {
  const builds = await buildServices.queryBuilds();

  res.status(200).send({ builds });
});

/**
 * Get build
 */
const getBuild = asyncHandler(async (req, res) => {
  const { buildId } = req.params;

  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

/**
 * Create build
 */
const createBuild = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const buildId = await buildServices.initBuild(userId);
  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

/**
 * Update build
 */
const updateBuild = asyncHandler(async (req, res) => {
  const { buildId } = req.params;

  await buildServices.updateBuildById(buildId, req.body);
  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

/**
 * Delete build
 */
const deleteBuild = asyncHandler(async (req, res) => {
  const { buildId } = req.params;

  await buildServices.deleteBuildById(buildId);

  res.status(200).end();
});

/**
 * Create build part
 */
const createBuildPart = asyncHandler(async (req, res) => {
  const { buildId, partId } = req.params;

  await buildServices.createBuildPart(buildId, partId);
  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

/**
 * Update build part
 */
const updateBuildPart = asyncHandler(async (req, res) => {
  const { buildId, partId } = req.params;
  const { quantity } = req.body;

  await buildServices.updateBuildPartById(buildId, partId, quantity);
  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

/**
 * Delete build part
 */
const deleteBuildPart = asyncHandler(async (req, res) => {
  const { buildId, partId } = req.params;

  await buildServices.deleteBuildPartById(buildId, partId);
  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

/**
 * Create build image
 */
const createBuildImage = asyncHandler(async (req, res) => {
  const { buildId } = req.params;

  await buildServices.createBuildImage(buildId, req.file);
  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

/**
 * Delete build image
 */
const deleteBuildImage = asyncHandler(async (req, res) => {
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
