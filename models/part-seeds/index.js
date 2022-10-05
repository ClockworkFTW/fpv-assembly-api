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
    const { type, name, manufacturer, image, weight, ...rest } = record;
    const { getfpv, pyrodrone, racedayquads, ...partSpecs } = rest;

    const part = await models.Part.create({
      type,
      name,
      manufacturer,
      image,
      weight,
    });

    const model = partServices.partTypeToModel(type);

    await models[model].create({
      ...partSpecs,
      partId: part.id,
    });

    await models.Listing.create({
      partId: part.id,
      vendor: "getfpv",
      link: getfpv,
    });

    await models.Listing.create({
      partId: part.id,
      vendor: "pyrodrone",
      link: pyrodrone,
    });

    await models.Listing.create({
      partId: part.id,
      vendor: "racedayquads",
      link: racedayquads,
    });
  }
};

export default seedParts;
