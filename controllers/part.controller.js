import { partTypeToModel } from "../models/part.model.js";

/**
 * Get all parts
 */
const getParts = async (req, res) => {
  const parts = await req.models.Part.getAll(req.models);

  res.status(200).send({ parts });
};

/**
 * Get one part
 */
const getPart = async (req, res) => {
  const { partId } = req.params;

  const part = await req.models.Part.getOne(req.models, partId);

  res.status(200).send({ part });
};

/**
 * Create part
 */
const createPart = async (req, res) => {
  const { type, name, manufacturer, image, weight, ...partSpecs } = req.body;

  let part = await req.models.Part.create({
    type,
    name,
    manufacturer,
    image,
    weight,
  });

  await req.models[partTypeToModel(type)].create({
    ...partSpecs,
    partId: part.id,
  });

  part = await req.models.Part.getOne(req.models, part.id);

  res.status(201).send({ part });
};

/**
 * Update part
 */
const updatePart = async (req, res) => {
  const { partId } = req.params;
  const { type, name, manufacturer, image, weight, ...partSpecs } = req.body;

  await req.models.Part.update(
    {
      type,
      name,
      manufacturer,
      image,
      weight,
    },
    { where: { id: partId } }
  );

  await req.models[partTypeToModel(type)].update(
    { partSpecs },
    { where: { partId } }
  );

  const part = await req.models.Part.getOne(req.models, partId);

  res.status(200).send({ part });
};

/**
 * Delete part
 */
const deletePart = async (req, res) => {
  const { partId } = req.params;

  await req.models.Part.destroy({ where: { id: partId } });

  res.status(204).end();
};

export { getParts, getPart, createPart, updatePart, deletePart };
