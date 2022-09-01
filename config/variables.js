import * as dotenv from "dotenv";

dotenv.config();

const env = process.env.NODE_ENV;
const port = process.env.PORT;

const jwt = {
  secret: process.env.JWT_SECRET,
  expirationInterval: process.env.JWT_EXPIRATION_INTERVAL,
};

const postgres =
  env === "production"
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

const logs = env === "production" ? "combined" : "dev";

export default { env, port, jwt, postgres, logs };
