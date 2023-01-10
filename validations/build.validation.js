import Joi from "joi";

const getBuild = {
  params: Joi.object({
    buildId: Joi.string().required(),
  }),
};

const updateBuild = {
  params: Joi.object({
    buildId: Joi.string().required(),
  }),
  body: Joi.object({
    name: Joi.string().allow(""),
    log: Joi.array().items(
      Joi.object({
        type: Joi.string().required(),
        width: Joi.string(),
        align: Joi.string(),
        url: Joi.string(),
        children: Joi.array().items(
          Joi.object({
            text: Joi.string().allow(""),
          })
        ),
      })
    ),
    isPublished: Joi.boolean(),
  }),
};

const deleteBuild = {
  params: Joi.object({
    buildId: Joi.string().required(),
  }),
};

const createBuildPart = {
  params: Joi.object({
    buildId: Joi.string().required(),
    partId: Joi.string().required(),
  }),
};

const updateBuildPart = {
  params: Joi.object({
    buildId: Joi.string().required(),
    partId: Joi.string().required(),
  }),
  body: Joi.object({
    quantity: Joi.number().required(),
  }),
};

const deleteBuildPart = {
  params: Joi.object({
    buildId: Joi.string().required(),
    partId: Joi.string().required(),
  }),
};

const createBuildComment = {
  params: Joi.object({
    buildId: Joi.string().required(),
  }),
  body: Joi.object({
    message: Joi.string().required(),
    parentId: Joi.string().allow(null),
  }),
};

const updateBuildComment = {
  params: Joi.object({
    buildId: Joi.string().required(),
    commentId: Joi.string().required(),
  }),
  body: Joi.object({
    message: Joi.string().required(),
  }),
};

const deleteBuildComment = {
  params: Joi.object({
    buildId: Joi.string().required(),
    commentId: Joi.string().required(),
  }),
};

const createBuildCommentVote = {
  params: Joi.object({
    buildId: Joi.string().required(),
    commentId: Joi.string().required(),
  }),
  body: Joi.object({
    vote: Joi.boolean().required(),
  }),
};

const updateBuildCommentVote = {
  params: Joi.object({
    buildId: Joi.string().required(),
    commentId: Joi.string().required(),
  }),
  body: Joi.object({
    vote: Joi.boolean().required(),
  }),
};

const deleteBuildCommentVote = {
  params: Joi.object({
    buildId: Joi.string().required(),
    commentId: Joi.string().required(),
  }),
};

const createBuildLike = {
  params: Joi.object({
    buildId: Joi.string().required(),
  }),
  body: Joi.object({
    likeId: Joi.string().required(),
  }),
};

const deleteBuildLike = {
  params: Joi.object({
    buildId: Joi.string().required(),
    likeId: Joi.string().required(),
  }),
};

const createBuildImage = {
  params: Joi.object({
    buildId: Joi.string().required(),
  }),
  body: Joi.object({
    buffer: Joi.binary().required(),
    destination: Joi.string().required(),
  }),
};

const deleteBuildImage = {
  params: Joi.object({
    buildId: Joi.string().required(),
    imageId: Joi.string().required(),
  }),
};

export default {
  getBuild,
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
  createBuildImage,
  deleteBuildImage,
};
