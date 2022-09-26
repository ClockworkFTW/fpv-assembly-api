import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import passport from "passport";
import passportStrategies from "./config/passport.js";
import errorHandler from "./middleware/error.js";
import routes from "./routes/index.js";
import config from "./config/variables.js";

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
app.use(cors(config.cors));

// passport authentication strategies
app.use(passport.initialize());
passport.use(passportStrategies.googleStrategy);
passport.use(passportStrategies.facebookStrategy);
passport.use(passportStrategies.appleStrategy);

// mount api routes
app.use("/api", routes);

// handle errors
app.use(errorHandler);

export default app;
