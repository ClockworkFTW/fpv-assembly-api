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
  createBuildImage,
  deleteBuildImage,
};
