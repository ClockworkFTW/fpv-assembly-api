import bcrypt from "bcrypt";
import generator from "generate-password";
import userServices from "../services/user.services.js";
import tokenServices from "../services/token.services.js";
import emailServices from "../services/email.services.js";
import catchAsync from "../util/catch-async.js";

/**
 * Local sign up
 */
const localSignUp = catchAsync(async (req, res) => {
  const { username, email, passwordA, passwordB } = req.body;

  if (passwordA !== passwordB) {
    throw new Error("Passwords do not match");
  }

  const hashedPassword = await bcrypt.hash(passwordA, 10);

  const userId = await userServices.createUser({
    email,
    username,
    hashedPassword,
  });

  const user = await userServices.getUserById(userId);

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
const localSignIn = catchAsync(async (req, res) => {
  const { username, password } = req.body;

  const user = await userServices.getUserByUsername(username);

  const match = user
    ? await bcrypt.compare(password, user.hashedPassword)
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
const googleSignIn = catchAsync(async (req, res) => {
  const token = await tokenServices.generateUserAccessToken(req.user.id);
  res.status(200).cookie("token", token.value).redirect("/");
});

/**
 * Facebook sign in
 */
const facebookSignIn = catchAsync(async (req, res) => {
  const token = await tokenServices.generateUserAccessToken(req.user.id);
  res.status(200).cookie("token", token.value).redirect("/");
});

/**
 * Apple sign in
 */
const appleSignIn = catchAsync(async (req, res) => {
  const token = await tokenServices.generateUserAccessToken(req.user.id);
  res.status(200).cookie("token", token.value).redirect("/");
});

/**
 * Request email verification
 */
const requestEmailVerification = catchAsync(async (req, res) => {
  const user = await userServices.getUserById(req.body.userId);
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
const verifyEmail = catchAsync(async (req, res) => {
  const token = await tokenServices.verifyToken(req.query.token);
  await userServices.updateUserById(token.userId, { isVerified: true });
  res.status(200).redirect("/");
});

/**
 * Request password reset
 */
const requestPasswordReset = catchAsync(async (req, res) => {
  const user = await userServices.getUserByEmail(req.body.email);
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
const resetPassword = catchAsync(async (req, res) => {
  const token = await tokenServices.verifyToken(req.query.token);

  const password = generator.generate({ length: 10, numbers: true });
  const hashedPassword = await bcrypt.hash(password, 10);

  await userServices.updateUserById(token.userId, { hashedPassword });
  const user = await userServices.getUserById(token.userId);

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
