import aws from "../config/aws.js";

/**
 * Send email verification email
 *
 * @param {String} username
 * @param {String} email
 * @param {String} token
 * @returns {Promise}
 */
const sendEmailVerificationEmail = async (username, email, token) => {
  const alias = "info";
  const subject = "Email Verification";
  const url = `https://jnb-api.ngrok.io/api/auth/verify-email?token=${token}`;
  const text = `Hi ${username},\n\nTo verify your email, click on this link: ${url}\n\nIf you did not sign up for an account, please ignore this email.`;

  await aws.sendEmail(alias, email, subject, text);
};

/**
 * Send email password reset
 *
 * @param {String} username
 * @param {String} email
 * @param {String} token
 * @returns {Promise}
 */
const sendPasswordResetEmail = async (username, email, token) => {
  const alias = "info";
  const subject = "Password Reset";
  const url = `https://jnb-api.ngrok.io/api/auth/reset-password?token=${token}`;
  const text = `Hi ${username},\n\nTo reset your password, click on this link: ${url}\n\nIf you did not request a reset, please ignore this email.`;

  await aws.sendEmail(alias, email, subject, text);
};

/**
 * Send temporary password email
 *
 * @param {String} username
 * @param {String} email
 * @param {String} password
 * @returns {Promise}
 */
const sendTemporaryPasswordEmail = async (username, email, password) => {
  const alias = "info";
  const subject = "Temporary Password";
  const text = `Hi ${username},\n\nYour temporary password is "${password}".\n\nPlease log in and update your password as soon as possible.`;

  await aws.sendEmail(alias, email, subject, text);
};

export default {
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
  sendTemporaryPasswordEmail,
};
