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
 * @param {String} userId
 * @param {String} type
 * @param {Object} config
 * @returns {Promise<String>} token
 */
const generateToken = async (userId, type, config) => {
  const user = await models.User.findByPk(userId, {
    attributes: { exclude: ["hashedPassword"] },
    raw: true,
  });

  const payload = {
    type,
    sub: userId,
    iat: dayjs().unix(),
    exp: dayjs().add(config.expirationInterval, config.expirationUnit).unix(),
    user,
  };

  const token = jwt.sign(payload, config.secret);

  return await models.Token.create({ type, userId, value: token });
};

/**
 * Generate access token
 *
 * @param {String} userId
 * @returns {Promise<Object>} token
 */
const generateAccessToken = async (userId) => {
  return await generateToken(userId, tokenTypes.access, config.jwt.accessToken);
};

/**
 * Generate refresh token
 *
 * @param {String} userId
 * @returns {Promise<Object>} token
 */
const generateRefreshToken = async (userId) => {
  return await generateToken(
    userId,
    tokenTypes.refresh,
    config.jwt.refreshToken
  );
};

/**
 * Generate email verification token
 *
 * @param {String} userId
 * @returns {Promise<Object>} token
 */
const generateEmailVerificationToken = async (userId) => {
  return await generateToken(
    userId,
    tokenTypes.emailVerification,
    config.jwt.emailVerificationToken
  );
};

/**
 * Generate password reset token
 *
 * @param {String} userId
 * @returns {Promise<Object>} token
 */
const generatePasswordResetToken = async (userId) => {
  return await generateToken(
    userId,
    tokenTypes.passwordReset,
    config.jwt.passwordResetToken
  );
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
