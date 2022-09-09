import { models } from "../config/postgres.js";

/**
 * Get user
 *
 * @param {object} config
 * @returns {Promise<object>} user
 */
const getUser = async (config) => {
  const user = await models.User.findOne({ ...config, raw: true });

  if (!user) {
    throw new Error("User not found");
  }

  // TODO: get associations and format response

  return user;
};

/**
 * Get user by ID
 *
 * @param {string} userId
 * @returns {Promise<object>} user
 */
const getUserById = async (userId) => {
  return await getUser({ where: { id: userId } });
};

/**
 * Get user by SSO ID
 *
 * @param {string} ssoId
 * @returns {Promise<object>} user
 */
const getUserBySsoId = async (ssoId) => {
  return await getUser({ where: { ssoId } });
};

/**
 * Get user by email
 *
 * @param {string} email
 * @returns {Promise<object>} user
 */
const getUserByEmail = async (email) => {
  return await getUser({ where: { email } });
};

/**
 * Get user by username
 *
 * @param {string} username
 * @returns {Promise<object>} user
 */
const getUserByUsername = async (username) => {
  return await getUser({ where: { username } });
};

/**
 * Create user
 *
 * @param {object} body
 * @returns {Promise<string>} userId
 */
const createUser = async (body) => {
  const user = await models.User.create(body);
  return user.id;
};

/**
 * Update user by id
 *
 * @async
 * @param {string} userId
 */
const updateUserById = async (userId, body) => {
  const user = await models.User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  await user.update(body);
};

export default {
  getUserById,
  getUserBySsoId,
  getUserByEmail,
  getUserByUsername,
  createUser,
  updateUserById,
};
