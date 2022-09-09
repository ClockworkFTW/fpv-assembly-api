import jwt from "jsonwebtoken";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import AppleStrategy from "passport-apple";
import userServices from "../services/user.services.js";
import { ssoProviders } from "../models/user.model.js";
import config from "./variables.js";

const googleVerify = async (req, accToken, refToken, profile, cb) => {
  try {
    let user = await userServices.getUserBySsoId(profile.id);

    if (!user) {
      user = await req.models.User.create({
        isVerified: true,
        ssoId: profile.id,
        ssoProvider: ssoProviders.GOOGLE,
        username: profile.displayName,
        email: profile.emails[0].value,
      });
    }

    cb(null, user);
  } catch (error) {
    cb(true, null);
  }
};

const googleStrategy = new GoogleStrategy(
  config.passport.provider.google,
  googleVerify
);

const facebookVerify = async (req, accToken, refToken, profile, cb) => {
  try {
    let user = await userServices.getUserBySsoId(profile.id);

    if (!user) {
      user = await req.models.User.create({
        isVerified: true,
        ssoId: profile.id,
        ssoProvider: ssoProviders.FACEBOOK,
        username: profile.displayName,
        email: profile.emails[0].value,
      });
    }

    cb(null, user);
  } catch (error) {
    cb(true, null);
  }
};

const facebookStrategy = new FacebookStrategy(
  config.passport.provider.facebook,
  facebookVerify
);

const appleVerify = async (req, accToken, refToken, idToken, profile, cb) => {
  try {
    profile = jwt.decode(idToken);

    let user = await userServices.getUserBySsoId(profile.id);

    if (!user) {
      const { name, email } = JSON.parse(req.body.user);
      user = await req.models.User.create({
        isVerified: true,
        ssoId: profile.sub,
        ssoProvider: ssoProviders.APPLE,
        username: `${name.firstName} ${name.lastName}`,
        email,
      });
    }

    cb(null, user);
  } catch (error) {
    cb(true, null);
  }
};

const appleStrategy = new AppleStrategy(
  config.passport.provider.apple,
  appleVerify
);

export default { googleStrategy, facebookStrategy, appleStrategy };
