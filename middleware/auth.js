import jwt from "jsonwebtoken";
import config from "../config/variables.js";

const auth = async (req, res, next) => {
  if (!req.cookies.token) {
    return res.status(403).send({ message: "missing token" });
  }

  const { token } = req.cookies;
  const decoded = jwt.verify(token, config.jwt.secret);

  if (!decoded) {
    return res.status(403).send({ message: "invalid token" });
  }

  const user = await req.models.User.findByPk(decoded.id, { raw: true });
  req.user = user;
  next();
};

export default auth;
