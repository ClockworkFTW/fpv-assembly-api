import Sequelize from "sequelize";

import config from "./variables.js";

import getUserModel from "../models/user.model.js";
import getBuildModel from "../models/build.model.js";
import getPartModel from "../models/part.model.js";
import getPriceModel from "../models/price.model.js";
import getImageModel from "../models/image.model.js";
import getMotorModel from "../models/part-types/motor.js";
import getFrameModel from "../models/part-types/frame.js";
import getBatteryModel from "../models/part-types/battery.js";
import getPropellerModel from "../models/part-types/propeller.js";
import getRadioReceiverModel from "../models/part-types/radio-receiver.js";
import getVideoCameraModel from "../models/part-types/video-camera.js";
import getVideoAntennaModel from "../models/part-types/video-antenna.js";
import getVideoTransmitterModel from "../models/part-types/video-transmitter.js";
import getFlightControllerModel from "../models/part-types/flight-controller.js";
import getElectronicSpeedControllerModel from "../models/part-types/electronic-speed-controller.js";

const sequelize = new Sequelize(
  config.postgres.database,
  config.postgres.user,
  config.postgres.password,
  {
    host: config.postgres.host,
    port: config.postgres.port,
    dialect: "postgres",
    logging: false,
  }
);

const models = {
  User: getUserModel(sequelize, Sequelize),
  Build: getBuildModel(sequelize, Sequelize),
  Part: getPartModel(sequelize, Sequelize),
  Price: getPriceModel(sequelize, Sequelize),
  Image: getImageModel(sequelize, Sequelize),
  Motor: getMotorModel(sequelize, Sequelize),
  Frame: getFrameModel(sequelize, Sequelize),
  Battery: getBatteryModel(sequelize, Sequelize),
  Propeller: getPropellerModel(sequelize, Sequelize),
  RadioReceiver: getRadioReceiverModel(sequelize, Sequelize),
  VideoCamera: getVideoCameraModel(sequelize, Sequelize),
  VideoAntenna: getVideoAntennaModel(sequelize, Sequelize),
  VideoTransmitter: getVideoTransmitterModel(sequelize, Sequelize),
  FlightController: getFlightControllerModel(sequelize, Sequelize),
  ElectronicSpeedController: getElectronicSpeedControllerModel(
    sequelize,
    Sequelize
  ),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize, models };
