import { models } from "../config/postgres.js";

/**
 * Get user by ID
 *
 * @param {Object} config
 * @returns {Promise<Object>} user
 */
const getUserById = async (userId) => {
  const user = await models.User.findByPk(userId, { raw: true });

  if (!user) {
    throw new Error("User not found");
  }

  // TODO: get associations and format response

  return user;
};

/**
 * Query users
 *
 * @param {Object} config
 * @return {Promise<Array>} part
 */
const queryUsers = async (config = {}) => {
  const users = await models.User.findAll({
    ...config,
    attributes: ["id"],
    raw: true,
  });

  return await Promise.all(
    users.map(async (user) => {
      return await getUserById(user.id);
    })
  );
};

export default {
  getUserById,
  queryUsers,
};
