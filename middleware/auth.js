import userServices from "../services/user.services.js";
import tokenServices from "../services/token.services.js";

const auth = (roles) => async (req, res, next) => {
  try {
    const authHeader = req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("Token missing");
    }

    const jwt = authHeader.split(" ")[1];

    const accessToken = await tokenServices.verifyAccessToken(jwt);
    const user = await userServices.getUserById(accessToken.userId);

    if (!user.isVerified) {
      throw new Error("User not verified");
    }

    if (!roles.includes(user.role)) {
      throw new Error("User not authorized");
    }

    req.auth = { userId: user.id };

    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
