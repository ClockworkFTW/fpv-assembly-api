import app from "./app.js";
import logger from "./config/logger.js";
import config from "./config/variables.js";
import { sequelize } from "./config/postgres.js";
import seedParts from "./models/part-seeds/index.js";

const eraseDatabaseOnSync = false;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  app.listen(config.port, () => {
    if (eraseDatabaseOnSync) {
      seedParts();
    }

    logger.info(`server started on port ${config.port} (${config.env})`);
  });
});
