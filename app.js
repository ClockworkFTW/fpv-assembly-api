import express from "express";
import morgan from "morgan";
import passport from "passport";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes/index.js";
import config from "./config/variables.js";
import passportStrategies from "./config/passport.js";
import { models } from "./config/postgres.js";

const app = express();

// request logging. dev: console | production: file
app.use(morgan(config.logs));

// parse body params and attach them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// parse cookies and attach them to req.cookies
app.use(cookieParser());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// add postgres models to request object
app.use((req, res, next) => {
  req.models = models;
  next();
});

// passport authentication strategies
app.use(passport.initialize());
passport.use(passportStrategies.googleStrategy);
passport.use(passportStrategies.facebookStrategy);
passport.use(passportStrategies.appleStrategy);

// mount api routes
app.use("/api", routes);

export default app;
