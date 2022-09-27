import httpStatus from "http-status";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import config from "../config/variables.js";
import { models } from "../config/postgres.js";
import { tokenTypes } from "../models/token.model.js";
import ApiError from "../util/ApiError.js";

/**
 * Generate token
 *
 * @param {String} type
 * @param {String} userId
 * @param {Integer} expirationInterval
 * @param {String} expirationUnit
 * @param {String} secret
 * @returns {String} token
 */
const generateToken = (type, userId, expInterval, expUnit, secret) => {
  const payload = {
    type,
    sub: userId,
    iat: dayjs().unix(),
    exp: dayjs().add(expInterval, expUnit).unix(),
  };

  return jwt.sign(payload, secret);
};

/**
 * Generate access token
 *
 * @param {String} userId
 * @returns {Promise<Object>} token
 */
const generateAccessToken = async (userId) => {
  const type = tokenTypes.ACCESS;

  const token = generateToken(
    type,
    userId,
    config.jwt.accessToken.expirationInterval,
    config.jwt.accessToken.expirationUnit,
    config.jwt.accessToken.secret
  );

  return await models.Token.create({ type, userId, value: token });
};

/**
 * Generate refresh token
 *
 * @param {String} userId
 * @returns {Promise<Object>} token
 */
const generateRefreshToken = async (userId) => {
  const type = tokenTypes.REFRESH;

  const token = generateToken(
    type,
    userId,
    config.jwt.refreshToken.expirationInterval,
    config.jwt.refreshToken.expirationUnit,
    config.jwt.refreshToken.secret
  );

  return await models.Token.create({ type, userId, value: token });
};

/**
 * Generate email verification token
 *
 * @param {String} userId
 * @returns {Promise<Object>} token
 */
const generateEmailVerificationToken = async (userId) => {
  const type = tokenTypes.EMAIL_VERIFICATION;

  const token = generateToken(
    type,
    userId,
    config.jwt.emailVerificationToken.expirationInterval,
    config.jwt.emailVerificationToken.expirationUnit,
    config.jwt.emailVerificationToken.secret
  );

  return await models.Token.create({ type, userId, value: token });
};

/**
 * Generate password reset token
 *
 * @param {String} userId
 * @returns {Promise<Object>} token
 */
const generatePasswordResetToken = async (userId) => {
  const type = tokenTypes.PASSWORD_RESET;

  const token = generateToken(
    type,
    userId,
    config.jwt.passwordResetToken.expirationInterval,
    config.jwt.passwordResetToken.expirationUnit,
    config.jwt.passwordResetToken.secret
  );

  return await models.Token.create({ type, userId, value: token });
};

/**
 * Verify token
 *
 * @param {String} token
 * @returns {Promise<Object>} token
 */
const verifyToken = async (token, secret) => {
  let payload;

  try {
    payload = jwt.verify(token, secret);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Token invalid");
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
    throw new ApiError(httpStatus.UNAUTHORIZED, "Token invalid");
  }

  return token;
};

/**
 * Verify access token
 *
 * @param {String} token
 * @returns {Promise<Object>} token
 */
const verifyAccessToken = async (token) => {
  const secret = config.jwt.accessToken.secret;

  return await verifyToken(token, secret);
};

/**
 * Verify refresh token
 *
 * @param {String} token
 * @returns {Promise<Object>} token
 */
const verifyRefreshToken = async (token) => {
  const secret = config.jwt.refreshToken.secret;

  return await verifyToken(token, secret);
};

/**
 * Verify email verification token
 *
 * @param {String} token
 * @returns {Promise<Object>} token
 */
const verifyEmailVerificationToken = async (token) => {
  const secret = config.jwt.emailVerificationToken.secret;

  return await verifyToken(token, secret);
};

/**
 * Verify password reset token
 *
 * @param {String} token
 * @returns {Promise<Object>} token
 */
const verifyPasswordResetToken = async (token) => {
  const secret = config.jwt.passwordResetToken.secret;

  return await verifyToken(token, secret);
};

export default {
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyEmailVerificationToken,
  verifyPasswordResetToken,
};
