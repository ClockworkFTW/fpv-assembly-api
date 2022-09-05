import partServices from "../services/part.services.js";

/**
 * Get parts
 */
const getParts = async (req, res) => {
  const parts = await partServices.getAll();

  res.status(200).send({ parts });
};

/**
 * Get part
 */
const getPart = async (req, res) => {
  const { partId } = req.params;

  const part = await partServices.getOne(partId);

  res.status(200).send({ part });
};

/**
 * Create part
 */
const createPart = async (req, res) => {
  const part = await partServices.createPart(req.body);

  res.status(201).send({ part });
};

/**
 * Update part
 */
const updatePart = async (req, res) => {
  const { partId } = req.params;

  const part = await partServices.updatePartById(partId, req.body);

  res.status(200).send({ part });
};

/**
 * Delete part
 */
const deletePart = async (req, res) => {
  const { partId } = req.params;

  await partServices.deletePartById(partId);

  res.status(204).end();
};

export default { getParts, getPart, createPart, updatePart, deletePart };
