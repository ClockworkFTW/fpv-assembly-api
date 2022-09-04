import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/variables.js";

/**
 * Local sign up
 */
const localSignUp = async (req, res) => {
  const { username, email, passwordA, passwordB } = req.body;

  if (passwordA !== passwordB) {
    return res.status(400).send({ message: "passwords do not match." });
  }

  const hashedPassword = await bcrypt.hash(passwordA, 10);

  const user = await req.models.User.create({
    ssoProvider: "local",
    username,
    email,
    hashedPassword,
  });

  const token = jwt.sign({ id: user.id }, config.jwt.secret, {
    expiresIn: config.jwt.expirationInterval,
  });

  res.status(200).cookie("token", token).redirect("/");
};

/**
 * Local sign in
 */
const localSignIn = async (req, res) => {
  const { username, password } = req.body;

  const user = await req.models.User.findOne({ where: { username } });

  const match = user
    ? await bcrypt.compare(password, user.hashedPassword)
    : false;

  if (!match) {
    return res.status(400).send({ message: "username or password incorrect." });
  }

  const token = jwt.sign({ id: user.id }, config.jwt.secret, {
    expiresIn: config.jwt.expirationInterval,
  });

  res.status(200).cookie("token", token).redirect("/");
};

/**
 * Google sign in
 */
const googleSignIn = async (req, res) => {
  const token = jwt.sign({ id: req.user.id }, config.jwt.secret, {
    expiresIn: config.jwt.expirationInterval,
  });

  res.status(200).cookie("token", token).redirect("/");
};

/**
 * Facebook sign in
 */
const facebookSignIn = async (req, res) => {
  const token = jwt.sign({ id: req.user.id }, config.jwt.secret, {
    expiresIn: config.jwt.expirationInterval,
  });

  res.status(200).cookie("token", token).redirect("/");
};

/**
 * Apple sign in
 */
const appleSignIn = async (req, res) => {
  const token = jwt.sign({ id: req.user.id }, config.jwt.secret, {
    expiresIn: config.jwt.expirationInterval,
  });

  res.status(200).cookie("token", token).redirect("/");
};

export default {
  localSignUp,
  localSignIn,
  googleSignIn,
  facebookSignIn,
  appleSignIn,
};
