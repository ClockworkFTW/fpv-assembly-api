import Joi from "joi";

const getUser = {
  params: Joi.object({
    userId: Joi.string().required(),
  }),
};

export default { getUser };
