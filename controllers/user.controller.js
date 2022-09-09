import userServices from "../services/user.services.js";
import catchAsync from "../util/catch-async.js";

/**
 * Get user
 */
const getUser = catchAsync(async (req, res) => {
  const user = await userServices.getUserById(req.params.userId);
  res.status(200).send({ user });
});

export default { getUser };
