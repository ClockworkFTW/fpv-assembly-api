import asyncHandler from "express-async-handler";
import userServices from "../services/user.services.js";

/**
 * Get user
 */
const getUser = asyncHandler(async (req, res) => {
  const user = await userServices.getUserById(req.params.userId);
  res.status(200).send({ user });
});

export default { getUser };
