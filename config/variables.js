import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

// TODO: Abstract to utility function
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  name: process.env.NAME,
  domain: process.env.DOMAIN,
};

const jwt = {
  secret: process.env.JWT_SECRET,
  userAccessTokenExpirationInterval:
    process.env.JWT_USER_ACCESS_TOKEN_EXPIRATION_INTERVAL,
  userAccessTokenExpirationUnit:
    process.env.JWT_USER_ACCESS_TOKEN_EXPIRATION_UNIT,
  passwordResetTokenExpirationInterval:
    process.env.JWT_PASSWORD_RESET_TOKEN_EXPIRATION_INTERVAL,
  passwordResetTokenExpirationUnit:
    process.env.JWT_PASSWORD_RESET_TOKEN_EXPIRATION_UNIT,
  emailVerificationTokenExpirationInterval:
    process.env.JWT_EMAIL_VERIFICATION_TOKEN_EXPIRATION_INTERVAL,
  emailVerificationTokenExpirationUnit:
    process.env.JWT_EMAIL_VERIFICATION_TOKEN_EXPIRATION_UNIT,
};

const postgres =
  app.env === "production"
    ? {
        database: process.env.POSTGRES_DATABASE_PROD,
        user: process.env.POSTGRES_USER_PROD,
        password: process.env.POSTGRES_PASSWORD_PROD,
        host: process.env.POSTGRES_HOST_PROD,
        port: process.env.POSTGRES_PORT_PROD,
      }
    : {
        database: process.env.POSTGRES_DATABASE_DEV,
        user: process.env.POSTGRES_USER_DEV,
        password: process.env.POSTGRES_PASSWORD_DEV,
        host: process.env.POSTGRES_HOST_DEV,
        port: process.env.POSTGRES_PORT_DEV,
      };

const aws = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucket: process.env.AWS_BUCKET,
  region: process.env.AWS_REGION,
};

const passport = {
  redirectOptions: {
    failureRedirect: "/login",
    failWithError: true,
    failureMessage: true,
    session: false,
  },
  provider: {
    google: {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
      scope: ["email", "profile"],
      passReqToCallback: true,
    },
    facebook: {
      clientID: process.env.FACEBOOK_OAUTH_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_OAUTH_CALLBACK_URL,
      profileFields: ["emails", "displayName", "photos"],
      passReqToCallback: true,
    },
    apple: {
      clientID: process.env.APPLE_OAUTH_CLIENT_ID,
      teamID: process.env.APPLE_OAUTH_TEAM_ID,
      keyID: process.env.APPLE_OAUTH_KEY_ID,
      callbackURL: process.env.APPLE_OAUTH_CALLBACK_URL,
      privateKeyLocation: `${__dirname}/AuthKey.p8`,
    },
  },
};

const logs = app.env === "production" ? "combined" : "dev";

export default { app, jwt, postgres, aws, passport, logs };
