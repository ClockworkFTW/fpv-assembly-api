import jwt from "jsonwebtoken";
import { v5 as uuidv5 } from "uuid";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import AppleStrategy from "passport-apple";
import { providers } from "../models/user.model.js";
import { models } from "../config/postgres.js";
import config from "./variables.js";

const googleStrategy = new GoogleStrategy(
  config.passport.provider.google,
  async (req, accToken, refToken, profile, cb) => {
    try {
      const userId = uuidv5(profile.id, config.namespace);
      let user = await models.User.findByPk(userId);

      if (!user) {
        await models.User.create({
          id: uuidv5(profile.id, config.namespace),
          username: profile.displayName,
          email: profile.emails[0]?.value,
          provider: providers.google,
          isVerified: true,
        });

        user = await models.User.findByPk(userId, { raw: true });
      }

      cb(null, user);
    } catch (error) {
      console.log(error); // TODO: Remove in prod
      cb("Google sign in failed", null);
    }
  }
);

const facebookStrategy = new FacebookStrategy(
  config.passport.provider.facebook,
  async (req, accToken, refToken, profile, cb) => {
    try {
      const userId = uuidv5(profile.id, config.namespace);
      let user = await models.User.findByPk(userId);

      if (!user) {
        await models.User.create({
          id: uuidv5(profile.id, config.namespace),
          username: profile.displayName,
          email: profile.emails[0]?.value,
          provider: providers.facebook,
          isVerified: true,
        });

        user = await models.User.findByPk(userId, { raw: true });
      }

      cb(null, user);
    } catch (error) {
      console.log(error); // TODO: Remove in prod
      cb("Facebook sign in failed", null);
    }
  }
);

const appleStrategy = new AppleStrategy(
  config.passport.provider.apple,
  async (req, accToken, refToken, idToken, profile, cb) => {
    try {
      profile = jwt.decode(idToken);

      const userId = uuidv5(profile.sub, config.namespace);
      let user = await models.User.findByPk(userId, { raw: true });

      if (!user) {
        const { name, email } = JSON.parse(req.body.user);

        await models.User.create({
          id: userId,
          username: `${name.firstName} ${name.lastName}`,
          email: email,
          provider: providers.apple,
          isVerified: true,
        });

        user = await models.User.findByPk(userId, { raw: true });
      }

      cb(null, user);
    } catch (error) {
      console.log(error); // TODO: Remove in prod
      cb("Apple sign in failed", null);
    }
  }
);

export default { googleStrategy, facebookStrategy, appleStrategy };
