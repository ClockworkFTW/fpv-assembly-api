import asyncHandler from "express-async-handler";
import userServices from "../services/user.services.js";
import { models } from "../config/postgres.js";

/**
 * Get users
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await userServices.queryUsers();

  res.status(200).send({ users });
});

/**
 * Get user
 */
const getUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await userServices.getUserById(userId);

  res.status(200).send({ user });
});

/**
 * Update user
 */
const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.auth;

  await models.User.update(req.body, { where: { id: userId } });

  res.status(200).end();
});

/**
 * Delete user
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.auth;

  await models.User.destroy({ where: { id: userId } });

  res.status(200).end();
});

export default { getUsers, getUser, updateUser, deleteUser };
