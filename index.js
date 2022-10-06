import app from "./app.js";
import logger from "./config/logger.js";
import config from "./config/variables.js";
import { sequelize } from "./config/postgres.js";
import seedParts from "./models/part-seeds/index.js";

const eraseDatabaseOnSync = false;

sequelize.sync({ force: eraseDatabaseOnSync }).then(() => {
  app.listen(config.app.port, async () => {
    if (eraseDatabaseOnSync) {
      await seedParts();
    }

    logger.info(
      `server started on port ${config.app.port} (${config.app.env})`
    );
  });
});
