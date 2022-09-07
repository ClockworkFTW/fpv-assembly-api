import jwt from "jsonwebtoken";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import AppleStrategy from "passport-apple";
import config from "./variables.js";

const googleVerify = async (req, accToken, refToken, profile, cb) => {
  let user = await req.models.User.findOne({
    where: { ssoId: profile.id },
  });

  if (!user) {
    user = await req.models.User.create({
      ssoId: profile.id,
      ssoProvider: "google",
      username: profile.displayName,
      email: profile.emails[0].value,
    });
  }

  cb(null, user);
};

const googleStrategy = new GoogleStrategy(
  config.passport.provider.google,
  googleVerify
);

const facebookVerify = async (req, accToken, refToken, profile, cb) => {
  let user = await req.models.User.findOne({
    where: { ssoId: profile.id },
  });

  if (!user) {
    user = await req.models.User.create({
      ssoId: profile.id,
      ssoProvider: "facebook",
      username: profile.displayName,
      email: profile.emails[0].value,
    });
  }

  cb(null, user);
};

const facebookStrategy = new FacebookStrategy(
  config.passport.provider.facebook,
  facebookVerify
);

const appleVerify = async (req, accToken, refToken, idToken, profile, cb) => {
  profile = jwt.decode(idToken);

  let user = await req.models.User.findOne({
    where: { ssoId: profile.sub },
  });

  if (!user) {
    const { name, email } = JSON.parse(req.body.user);
    user = await req.models.User.create({
      ssoId: profile.sub,
      ssoProvider: "apple",
      username: `${name.firstName} ${name.lastName}`,
      email,
    });
  }

  cb(null, user);
};

const appleStrategy = new AppleStrategy(
  config.passport.provider.apple,
  appleVerify
);

export default { googleStrategy, facebookStrategy, appleStrategy };
