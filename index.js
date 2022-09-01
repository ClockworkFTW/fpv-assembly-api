import app from "./config/express.js";
import logger from "./config/logger.js";
import { port, env } from "./config/vars.js";
import { sequelize } from "./config/postgres.js";
import seedParts from "./models/part-seeds/index.js";

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  app.listen(port, () => {
    if (eraseDatabaseOnSync) {
      seedParts();
    }

    logger.info(`server started on port ${port} (${env})`);
  });
});
