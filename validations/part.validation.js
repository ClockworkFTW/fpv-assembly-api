import Joi from "joi";

const getPart = {
  params: Joi.object({
    partId: Joi.string().required(),
  }),
};

const createPart = {
  body: Joi.object({
    metaData: Joi.object({
      type: Joi.string().required(),
      name: Joi.string().required(),
      manufacturer: Joi.string().required(),
      image: Joi.string().required(),
      weight: Joi.number().required(),
    }),
    specData: Joi.object().required(),
  }),
};

const updatePart = {
  params: Joi.object({
    partId: Joi.string().required(),
  }),
  body: Joi.object({
    metaData: Joi.object({
      type: Joi.string().required(),
      name: Joi.string().required(),
      manufacturer: Joi.string().required(),
      image: Joi.string().required(),
      weight: Joi.number().required(),
    }),
    specData: Joi.object().required(),
  }),
};

const deletePart = {
  params: Joi.object({
    partId: Joi.string().required(),
  }),
};

const createPartReview = {
  params: Joi.object({
    partId: Joi.string().required(),
  }),
  body: Joi.object({
    message: Joi.string().required(),
    rating: Joi.number().required(),
  }),
};

const updatePartReview = {
  params: Joi.object({
    partId: Joi.string().required(),
    reviewId: Joi.string().required(),
  }),
  body: Joi.object({
    message: Joi.string().required(),
    rating: Joi.number().required(),
  }),
};

const deletePartReview = {
  params: Joi.object({
    partId: Joi.string().required(),
    reviewId: Joi.string().required(),
  }),
};

export const partSchemas = {
  motor: Joi.object({
    kv: Joi.number().required(),
    motorDiameter: Joi.number().required(),
    motorHeight: Joi.number().required(),
    shaftDiameter: Joi.number().required(),
    motorMountWidth: Joi.number().required(),
    motorMountLength: Joi.number().required(),
  }),
  propeller: Joi.object({
    diameter: Joi.number().required(),
    pitchAngle: Joi.number().required(),
    bladeCount: Joi.number().required(),
    shaftDiameter: Joi.number().required(),
  }),
  propeller: Joi.object({
    diameter: Joi.number().required(),
    pitchAngle: Joi.number().required(),
    bladeCount: Joi.number().required(),
    shaftDiameter: Joi.number().required(),
  }),
  frame: Joi.object({
    layout: Joi.string().required(),
    wheelbase: Joi.number().required(),
    motorMountWidth: Joi.number().required(),
    motorMountLength: Joi.number().required(),
    stackMountWidth: Joi.number().required(),
    stackMountLength: Joi.number().required(),
  }),
  flightController: Joi.object({
    firmware: Joi.string().required(),
    processor: Joi.string().required(),
    stackMountWidth: Joi.number().required(),
    stackMountLength: Joi.number().required(),
  }),
  electronicSpeedController: Joi.object({
    individual: Joi.boolean().required(),
    firmware: Joi.string().required(),
    stackMountWidth: Joi.number().required(),
    stackMountLength: Joi.number().required(),
  }),
  radioReceiver: Joi.object({
    txProtocol: Joi.string().required(),
    rxProtocol: Joi.string().required(),
  }),
  videoAntenna: Joi.object({
    minFrequency: Joi.number().required(),
    maxFrequency: Joi.number().required(),
    gain: Joi.number().required(),
    length: Joi.number().required(),
    connector: Joi.string().required(),
  }),
  videoCamera: Joi.object({
    transmission: Joi.string().required(),
    cameraSize: Joi.number().required(),
    sensorType: Joi.string().required(),
    sensorSize: Joi.number().required(),
    minIllumination: Joi.number().required(),
    fieldOfView: Joi.number().required(),
  }),
  videoTransmitter: Joi.object({
    transmission: Joi.string().required(),
    frequency: Joi.number().required(),
    minPowerLevel: Joi.number().required(),
    maxPowerLevel: Joi.number().required(),
    stackMountWidth: Joi.number().required(),
    stackMountLength: Joi.number().required(),
  }),
};

export default {
  getPart,
  createPart,
  updatePart,
  deletePart,
  createPartReview,
  updatePartReview,
  deletePartReview,
};
