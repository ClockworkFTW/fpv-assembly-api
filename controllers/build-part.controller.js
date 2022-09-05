import buildPartServices from "../services/build-part.services.js";

/**
 * Create a build part by ID
 */
const createBuildPart = async (req, res) => {
  const { buildId, partId } = req.body;

  const build = await buildPartServices.createBuildPart(buildId, partId);

  res.status(200).send({ build });
};

/**
 * Update a build part by ID
 */
const updateBuildPart = async (req, res) => {
  const { buildPartId } = req.params;
  const { quantity } = req.body;

  const build = await buildPartServices.updateBuildPartById(
    buildPartId,
    quantity
  );

  res.status(200).send({ build });
};

/**
 * Delete a build part by ID
 */
const deleteBuildPart = async (req, res) => {
  const { buildPartId } = req.params;

  const build = await buildPartServices.deleteBuildPartById(buildPartId);

  res.status(200).send({ build });
};

export default {
  createBuildPart,
  updateBuildPart,
  deleteBuildPart,
};
