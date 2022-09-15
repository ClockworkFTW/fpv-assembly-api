import Joi from "joi";

const localSignUp = {
  body: Joi.object({
    email: Joi.string().required().email(),
    passwordA: Joi.string().required(),
    passwordB: Joi.string().required(),
    username: Joi.string().required(),
  }),
};

const localSignIn = {
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const requestEmailVerification = {
  body: Joi.object({
    email: Joi.string().required().email(),
  }),
};

const requestPasswordReset = {
  body: Joi.object({
    email: Joi.string().required().email(),
  }),
};

export default {
  localSignUp,
  localSignIn,
  requestEmailVerification,
  requestPasswordReset,
};
