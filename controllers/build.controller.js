import asyncHandler from "express-async-handler";
import aws from "../config/aws.js";
import buildServices from "../services/build.services.js";
import { models, sequelize } from "../config/postgres.js";
import { Op } from "sequelize";

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

  let build = await models.Build.create({ userId });

  await models.User.update(
    { activeBuildId: build.id },
    { where: { id: userId } }
  );

  build = await buildServices.getBuildById(build.id);

  res.status(200).send({ build });
});

/**
 * Update build
 */
const updateBuild = asyncHandler(async (req, res) => {
  const { userId } = req.auth;
  const { buildId } = req.params;

  let build = await models.Build.findByPk(buildId);

  if (!build) {
    throw new Error("Build not found");
  }

  await build.update(req.body);

  if (req.body.isPublished) {
    await models.User.update(
      { activeBuildId: null },
      { where: { id: userId } }
    );
  }

  build = await buildServices.getBuildById(build.id);

  res.status(200).send({ build });
});

/**
 * Delete build
 */
const deleteBuild = asyncHandler(async (req, res) => {
  const { userId } = req.auth;
  const { buildId } = req.params;

  const build = await models.Build.findByPk(buildId);

  if (!build) {
    throw new Error("Build not found");
  }

  await build.destroy();

  await models.User.update({ activeBuildId: null }, { where: { id: userId } });

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
 * Upload build images
 */
const uploadBuildImages = asyncHandler(async (req, res) => {
  const { userId } = req.auth;
  const { buildId } = req.params;

  const { max } = await models.BuildImage.findOne({
    attributes: [sequelize.fn("MAX", sequelize.col("index"))],
    where: { buildId },
    raw: true,
  });

  await Promise.all(
    req.files.map(async (file, i) => {
      const result = await aws.uploadFile(file.buffer, file.destination);
      const image = await models.Image.create({ ...result, userId });
      const index = (max || 0) + (typeof max === "number" ? i + 1 : i);
      await models.BuildImage.create({ index, buildId, imageId: image.id });
    })
  );

  const build = await buildServices.getBuildById(buildId);

  res.status(200).send({ build });
});

/**
 * Reorder build images
 */
const reorderBuildImages = asyncHandler(async (req, res) => {
  const { buildId } = req.params;
  const { images } = req.body;

  await Promise.all(
    images.map(async ({ id, index }) => {
      await models.BuildImage.update(
        { index },
        { where: { buildId, imageId: id } }
      );
    })
  );

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

  const { index } = await models.BuildImage.findOne({
    where: { buildId, imageId },
    raw: true,
  });

  const buildImages = await models.BuildImage.findAll({
    where: { index: { [Op.gt]: index } },
    raw: true,
  });

  await Promise.all(
    buildImages.map(async (buildImage) => {
      await models.BuildImage.update(
        { index: buildImage.index - 1 },
        { where: buildImage }
      );
    })
  );

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
  uploadBuildImages,
  reorderBuildImages,
  deleteBuildImage,
};
