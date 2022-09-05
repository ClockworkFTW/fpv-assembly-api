import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { parse } from "csv-parse";
import { models } from "../../config/postgres.js";
import partServices from "../../services/part.services.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const parser = parse({ columns: true, bom: true });

const seedParts = async () => {
  const records = fs.createReadStream(`${__dirname}/motors.csv`).pipe(parser);

  for await (const record of records) {
    const { type, name, manufacturer, image, weight, ...partSpecs } = record;

    const part = await models.Part.create({
      type,
      name,
      manufacturer,
      image,
      weight,
    });

    await models[partServices.typeToModel(type)].create({
      ...partSpecs,
      partId: part.id,
    });
  }
};

export default seedParts;
