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
 * Create build comment
 */
const createBuildComment = asyncHandler(async (req, res) => {
  const { userId } = req.auth;
  const { buildId } = req.params;
  const { parentId, message } = req.body;

  const comment = await models.Comment.create({
    userId,
    buildId,
    parentId,
    message,
  });

  if (parentId) {
    await models.CommentChild.create({
      commentId: parentId,
      childId: comment.id,
    });
  }

  res.sendStatus(201);
});

/**
 * Update build comment
 */
const updateBuildComment = asyncHandler(async (req, res) => {
  const { userId } = req.auth;
  const { commentId } = req.params;
  const { message } = req.body;

  const comment = await models.Comment.findByPk(commentId);

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.userId !== userId) {
    throw new Error("Comment cannot be edited");
  }

  await comment.update({ message });

  res.sendStatus(204);
});

/**
 * Delete build comment
 */
const deleteBuildComment = asyncHandler(async (req, res) => {
  const { userId } = req.auth;
  const { commentId } = req.params;

  const comment = await models.Comment.findByPk(commentId);

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.userId !== userId) {
    throw new Error("Comment cannot be deleted");
  }

  await comment.update({ isDeleted: true });

  res.sendStatus(204);
});

/**
 * Create build comment vote
 */
const createBuildCommentVote = asyncHandler(async (req, res) => {
  const { userId } = req.auth;
  const { commentId } = req.params;
  const { vote } = req.body;

  const comment = await models.Comment.findByPk(commentId);

  if (!comment) {
    throw new Error("Comment not found");
  }

  await models.CommentVote.create({ userId, commentId, vote });

  res.sendStatus(201);
});

/**
 * Update build comment vote
 */
const updateBuildCommentVote = asyncHandler(async (req, res) => {
  const { userId } = req.auth;
  const { commentId } = req.params;

  const comment = await models.Comment.findByPk(commentId);

  if (!comment) {
    throw new Error("Comment not found");
  }

  const vote = await models.CommentVote.findOne({
    where: { commentId },
  });

  if (!vote || vote.userId !== userId) {
    throw new Error("Vote could not be cast");
  }

  await vote.update({ ...req.body });

  res.sendStatus(201);
});

/**
 * Delete build comment vote
 */
const deleteBuildCommentVote = asyncHandler(async (req, res) => {
  const { userId } = req.auth;
  const { commentId } = req.params;

  const comment = await models.Comment.findByPk(commentId);

  if (!comment) {
    throw new Error("Comment not found");
  }

  const vote = await models.CommentVote.findOne({
    where: { commentId },
  });

  if (!vote || vote.userId !== userId) {
    throw new Error("Vote could not be cast");
  }

  await vote.destroy();

  res.status(204).end();
});

/**
 * Create build like
 */
const createBuildLike = asyncHandler(async (req, res) => {
  const { userId } = req.auth;
  const { buildId } = req.params;
  const { likeId } = req.body;

  const existingBuildLike = await models.BuildLike.findOne({
    where: { buildId, userId },
  });

  if (existingBuildLike) {
    throw new Error("Build has already been liked");
  }

  await models.BuildLike.create({ id: likeId, buildId, userId });

  res.status(201).end();
});

/**
 * Delete build like
 */
const deleteBuildLike = asyncHandler(async (req, res) => {
  const { userId } = req.auth;
  const { likeId } = req.params;

  const buildLike = await models.BuildLike.findByPk(likeId);

  if (!buildLike) {
    throw new Error("Like not found");
  }

  if (buildLike.userId !== userId) {
    throw new Error("Like cannot be deleted");
  }

  await buildLike.destroy();

  res.status(204).end();
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
      const result = await aws.uploadFile(file.body, file.key);
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
  createBuildComment,
  updateBuildComment,
  deleteBuildComment,
  createBuildCommentVote,
  updateBuildCommentVote,
  deleteBuildCommentVote,
  createBuildLike,
  deleteBuildLike,
  uploadBuildImages,
  reorderBuildImages,
  deleteBuildImage,
};
