import bcrypt from "bcrypt";
import generator from "generate-password";
import asyncHandler from "express-async-handler";
import tokenServices from "../services/token.services.js";
import emailServices from "../services/email.services.js";
import { models } from "../config/postgres.js";

// TODO: Move to config?
const cookieOptions = {
  httpOnly: true,
  sameSite: "None",
  secure: true,
  maxAge: 60 * 60 * 1000, // 1 hour
};

// TODO: Move to config?
const redirectURL = "https://jnb-app.ngrok.io";

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

  const emailVerificationToken =
    await tokenServices.generateEmailVerificationToken(user.id);

  await emailServices.sendEmailVerificationEmail(
    user.username,
    user.email,
    emailVerificationToken.value
  );

  const refreshToken = await tokenServices.generateRefreshToken(user.id);

  res.cookie("jwt", refreshToken.value, cookieOptions);

  const accessToken = await tokenServices.generateAccessToken(
    refreshToken.userId
  );

  res.status(200).json({ token: accessToken.value });
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

  const refreshToken = await tokenServices.generateRefreshToken(user.id);

  res.cookie("jwt", refreshToken.value, cookieOptions);

  const accessToken = await tokenServices.generateAccessToken(
    refreshToken.userId
  );

  res.status(200).json({ token: accessToken.value });
});

/**
 * Google sign in
 */
const googleSignIn = asyncHandler(async (req, res) => {
  const refreshToken = await tokenServices.generateRefreshToken(req.user.id);

  res.cookie("jwt", refreshToken.value, cookieOptions);

  res.status(200).redirect(redirectURL);
});

/**
 * Facebook sign in
 */
const facebookSignIn = asyncHandler(async (req, res) => {
  const refreshToken = await tokenServices.generateRefreshToken(req.user.id);

  res.cookie("jwt", refreshToken.value, cookieOptions);

  res.status(200).redirect(redirectURL);
});

/**
 * Apple sign in
 */
const appleSignIn = asyncHandler(async (req, res) => {
  const refreshToken = await tokenServices.generateRefreshToken(req.user.id);

  res.cookie("jwt", refreshToken.value, cookieOptions);

  res.status(200).redirect(redirectURL);
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
 * Verify email
 */
const verifyEmail = asyncHandler(async (req, res) => {
  const token = await tokenServices.verifyEmailVerificationToken(
    req.query.token
  );
  const user = await models.User.findByPk(token.userId);

  if (!user) {
    throw new Error("User not found");
  }

  await user.update({ isVerified: true });

  res.status(200).redirect(`${redirectURL}/sign-in`);
});

/**
 * Reset password
 */
const resetPassword = asyncHandler(async (req, res) => {
  const token = await tokenServices.verifyPasswordResetToken(req.query.token);
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

  res.status(200).redirect(`${redirectURL}/sign-in`);
});

/**
 * Refresh access token
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
  if (!req.cookies?.jwt) {
    throw new Error("Token missing");
  }

  const refreshToken = await tokenServices.verifyRefreshToken(req.cookies.jwt);

  const accessToken = await tokenServices.generateAccessToken(
    refreshToken.userId
  );

  res.status(200).json({ token: accessToken.value });
});

/**
 * Sign Out
 */
const signOut = asyncHandler(async (req, res) => {
  if (!req.cookies?.jwt) {
    throw new Error("Token missing");
  }

  // TODO: Delete token from database?

  res.clearCookie("jwt", cookieOptions);

  res.status(200).end();
});

export default {
  localSignUp,
  localSignIn,
  googleSignIn,
  facebookSignIn,
  appleSignIn,
  requestEmailVerification,
  requestPasswordReset,
  verifyEmail,
  resetPassword,
  refreshAccessToken,
  signOut,
};
