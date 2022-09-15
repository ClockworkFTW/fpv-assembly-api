import Joi from "joi";

const validate = (schema) => (req, res, next) => {
  const data = Object.keys(schema).reduce(
    (obj, key) => ({ ...obj, [key]: req[key] }),
    {}
  );

  const { error } = Joi.compile(schema).validate(data);

  if (error) {
    const messages = error.details.map((details) => details.message).join(", ");
    return next(new Error(messages));
  }

  next();
};

export const validatePart = (partSchemas) => (req, res, next) => {
  const type = req.body.metaData.type;
  const schema = { body: { partSpec: partSchemas[type] } };
  const data = { body: { partSpec: req.body.specData } };

  const { error } = Joi.compile(schema).validate(data);

  if (error) {
    const messages = error.details.map((details) => details.message).join(", ");
    return next(new Error(messages));
  }

  next();
};

export default validate;
