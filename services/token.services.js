import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import config from "../config/variables.js";
import { models } from "../config/postgres.js";
import { tokenTypes } from "../models/token.model.js";

/**
 * Generate token
 *
 * @param {string} type
 * @param {string} userId
 * @param {integer} expirationInterval
 * @param {string} expirationUnit
 * @returns {string} token
 */
const generateToken = (type, userId, expirationInterval, expirationUnit) => {
  const payload = {
    type,
    sub: userId,
    iat: dayjs().unix(),
    exp: dayjs().add(expirationInterval, expirationUnit).unix(),
  };

  return jwt.sign(payload, config.jwt.secret);
};

/**
 * Generate access token
 *
 * @param {string} userId
 * @returns {Promise<object>} token
 */
const generateUserAccessToken = async (userId) => {
  const type = tokenTypes.USER_ACCESS;

  const token = generateToken(
    type,
    userId,
    config.jwt.userAccessTokenExpirationInterval,
    config.jwt.userAccessTokenExpirationUnit
  );

  return await models.Token.create({ type, userId, value: token });
};

/**
 * Generate email verification token
 *
 * @param {string} userId
 * @returns {Promise<object>} token
 */
const generateEmailVerificationToken = async (userId) => {
  const type = tokenTypes.EMAIL_VERIFICATION;

  const token = generateToken(
    type,
    userId,
    config.jwt.emailVerificationTokenExpirationInterval,
    config.jwt.emailVerificationTokenExpirationUnit
  );

  return await models.Token.create({ type, userId, value: token });
};

/**
 * Generate password reset token
 *
 * @param {string} userId
 * @returns {Promise<object>} token
 */
const generatePasswordResetToken = async (userId) => {
  const type = tokenTypes.PASSWORD_RESET;

  const token = generateToken(
    type,
    userId,
    config.jwt.passwordResetTokenExpirationInterval,
    config.jwt.passwordResetTokenExpirationUnit
  );

  return await models.Token.create({ type, userId, value: token });
};

/**
 * Verify token
 *
 * @param {string} token
 * @returns {Promise<object>} token
 */
const verifyToken = async (token) => {
  let payload;

  try {
    payload = jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error("Token invalid");
  }

  token = await models.Token.findOne({
    where: {
      value: token,
      userId: payload.sub,
      type: payload.type,
    },
    raw: true,
  });

  if (!token) {
    throw new Error("Token invalid");
  }

  return token;
};

export default {
  generateUserAccessToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  verifyToken,
};
