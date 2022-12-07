import asyncHandler from "express-async-handler";
import aws from "../config/aws.js";
import buildServices from "../services/build.services.js";
import { models } from "../config/postgres.js";

/**
 * Get builds
 */
const getBuilds = asyncHandler(async (req, res) => {
  const builds = await buildServices.queryBuilds({
    where: { isPublished: true },
  });

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
  const { userId } = req.auth;

  const { username } = await models.User.findByPk(userId);

  const name = `${username}'s Build`;

  let build = await models.Build.create({ userId, name });

  build = await buildServices.getBuildById(build.id);

  res.status(200).send({ build });
});

/**
 * Update build
 */
const updateBuild = asyncHandler(async (req, res) => {
  const { buildId } = req.params;

  let build = await models.Build.findByPk(buildId);

  if (!build) {
    throw new Error("Build not found");
  }

  await build.update(req.body);

  build = await buildServices.getBuildById(build.id);

  res.status(200).send({ build });
});

/**
 * Delete build
 */
const deleteBuild = asyncHandler(async (req, res) => {
  const { buildId } = req.params;

  const build = await models.Build.findByPk(buildId);

  if (!build) {
    throw new Error("Build not found");
  }

  await build.destroy();

  res.status(200).end();
});

/**
 * Create build part
 */
const createBuildPart = asyncHandler(async (req, res) => {
  const { buildId, partId } = req.params;

  await models.BuildPart.create({ buildId, partId });

  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

/**
 * Update build part
 */
const updateBuildPart = asyncHandler(async (req, res) => {
  const { buildId, partId } = req.params;
  const { quantity } = req.body;

  const buildPart = await models.BuildPart.findOne({
    where: { buildId, partId },
  });

  if (!buildPart) {
    throw new Error("Build part not found");
  }

  await buildPart.update({ quantity });

  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

/**
 * Delete build part
 */
const deleteBuildPart = asyncHandler(async (req, res) => {
  const { buildId, partId } = req.params;

  const buildPart = await models.BuildPart.findOne({
    where: { buildId, partId },
  });

  if (!buildPart) {
    throw new Error("Build part not found");
  }

  await buildPart.destroy();

  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

/**
 * Create build image
 */
const createBuildImage = asyncHandler(async (req, res) => {
  const { buildId } = req.params;
  const { buffer, destination } = req.file;

  const data = await aws.uploadFile(buffer, destination);

  await models.Image.create({ ...data, buildId });

  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

/**
 * Delete build image
 */
const deleteBuildImage = asyncHandler(async (req, res) => {
  const { buildId, imageId } = req.params;

  const image = await models.Image.findByPk(imageId);

  if (!image) {
    throw new Error("Image not found");
  }

  await aws.deleteFile(image.bucket, image.key);
  await image.destroy();

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
