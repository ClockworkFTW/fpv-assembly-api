import asyncHandler from "express-async-handler";
import userServices from "../services/user.services.js";

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

export default { getUsers, getUser };
