import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { jwt } from "../config/vars.js";

/**
 * Sign up
 */
const signUp = async (req, res) => {
  const { username, email, passwordA, passwordB } = req.body;

  if (passwordA !== passwordB) {
    return res.status(400).send({ message: "passwords do not match." });
  }

  const hashedPassword = await bcrypt.hash(passwordA, 10);

  await req.models.User.create({
    username,
    email,
    hashedPassword,
  });

  const token = jsonwebtoken.sign({ username }, jwt.secret, {
    expiresIn: jwt.expirationInterval,
  });

  res.status(200).send(token);
};

/**
 * Sign in
 */
const signIn = async (req, res) => {
  const { username, password } = req.body;

  const user = await req.models.User.findOne({ where: { username } });

  const match = user
    ? await bcrypt.compare(password, user.hashedPassword)
    : false;

  if (!match) {
    return res.status(400).send({ message: "username or password incorrect." });
  }

  const token = jsonwebtoken.sign({ username }, jwt.secret, {
    expiresIn: jwt.expirationInterval,
  });

  res.status(200).send(token);
};

export { signUp, signIn };
