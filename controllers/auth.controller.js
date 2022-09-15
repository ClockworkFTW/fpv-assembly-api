import bcrypt from "bcrypt";
import generator from "generate-password";
import asyncHandler from "express-async-handler";
import tokenServices from "../services/token.services.js";
import emailServices from "../services/email.services.js";
import { models } from "../config/postgres.js";

/**
 * Local sign up
 */
const localSignUp = asyncHandler(async (req, res) => {
  const { username, email, passwordA, passwordB } = req.body;

  if (passwordA !== passwordB) {
    throw new Error("Passwords do not match");
  }

  const hashedPassword = await bcrypt.hash(passwordA, 10);

  let user = await models.User.create({
    email,
    username,
    hashedPassword,
  });

  user = await models.User.findByPk(user.id, { raw: true });

  const token = await tokenServices.generateUserAccessToken(user.id);

  await emailServices.sendEmailVerificationEmail(
    user.username,
    user.email,
    token.value
  );

  res.status(200).cookie("token", token.value).end();
});

/**
 * Local sign in
 */
const localSignIn = asyncHandler(async (req, res) => {
  const user = await models.User.findOne({
    where: { email: req.body.email },
    raw: true,
  });

  const match = user
    ? await bcrypt.compare(req.body.password, user.hashedPassword)
    : false;

  if (!match) {
    throw new Error("Username or password incorrect");
  }

  const token = await tokenServices.generateUserAccessToken(user.id);

  res.status(200).cookie("token", token.value).end();
});

/**
 * Google sign in
 */
const googleSignIn = asyncHandler(async (req, res) => {
  const token = await tokenServices.generateUserAccessToken(req.user.id);
  res.status(200).cookie("token", token.value).redirect("/");
});

/**
 * Facebook sign in
 */
const facebookSignIn = asyncHandler(async (req, res) => {
  const token = await tokenServices.generateUserAccessToken(req.user.id);
  res.status(200).cookie("token", token.value).redirect("/");
});

/**
 * Apple sign in
 */
const appleSignIn = asyncHandler(async (req, res) => {
  const token = await tokenServices.generateUserAccessToken(req.user.id);
  res.status(200).cookie("token", token.value).redirect("/");
});

/**
 * Request email verification
 */
const requestEmailVerification = asyncHandler(async (req, res) => {
  const user = await models.User.findOne({
    where: { email: req.body.email },
    raw: true,
  });

  if (!user) {
    throw new Error("User not found");
  }

  const token = await tokenServices.generateEmailVerificationToken(user.id);

  await emailServices.sendEmailVerificationEmail(
    user.username,
    user.email,
    token.value
  );

  res.status(200).end();
});

/**
 * Verify email
 */
const verifyEmail = asyncHandler(async (req, res) => {
  const token = await tokenServices.verifyToken(req.query.token);
  const user = await models.User.findByPk(token.userId);

  if (!user) {
    throw new Error("User not found");
  }

  await user.update({ isVerified: true });

  res.status(200).redirect("/");
});

/**
 * Request password reset
 */
const requestPasswordReset = asyncHandler(async (req, res) => {
  const user = await models.User.findOne({
    where: { email: req.body.email },
    raw: true,
  });

  if (!user) {
    throw new Error("User not found");
  }

  const token = await tokenServices.generatePasswordResetToken(user.id);

  await emailServices.sendPasswordResetEmail(
    user.username,
    user.email,
    token.value
  );

  res.status(200).end();
});

/**
 * Reset password
 */
const resetPassword = asyncHandler(async (req, res) => {
  const token = await tokenServices.verifyToken(req.query.token);
  const user = await models.User.findByPk(token.userId);

  if (!user) {
    throw new Error("User not found");
  }

  const password = generator.generate({ length: 10, numbers: true });
  const hashedPassword = await bcrypt.hash(password, 10);

  await user.update({ hashedPassword });

  await emailServices.sendTemporaryPasswordEmail(
    user.username,
    user.email,
    password
  );

  res.status(200).redirect("/");
});

export default {
  localSignUp,
  localSignIn,
  googleSignIn,
  facebookSignIn,
  appleSignIn,
  verifyEmail,
  requestEmailVerification,
  resetPassword,
  requestPasswordReset,
};
