import dayjs from "dayjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { v5 as uuidv5 } from "uuid";
import config from "../../config/variables.js";
import { models } from "../../config/postgres.js";
import partServices from "../../services/part.services.js";
import csv from "../../util/csv.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedParts = async () => {
  // Get records from CSV file
  const records = await csv.getRecords(`${__dirname}/motors.csv`);

  let i = 1;

  console.log("Seeding database...");

  for (const record of records) {
    // Extract meta data from record
    const { type, name, manufacturer, image, weight, price, ...rest } = record;

    // Extract part specifications and listings from record
    const { getfpv, pyrodrone, racedayquads, ...partSpecs } = rest;

    // Create part meta data
    const part = await models.Part.create({
      type,
      name,
      manufacturer,
      image,
      weight,
      currentPrice: price,
    });

    // Create part specifications
    const model = partServices.partTypeToModel(type);

    await models[model].create({
      ...partSpecs,
      partId: part.id,
    });

    // Create part listings
    const getfpvListing = await models.Listing.create({
      partId: part.id,
      vendor: "getfpv",
      link: getfpv,
    });

    const pyrodroneListing = await models.Listing.create({
      partId: part.id,
      vendor: "pyrodrone",
      link: pyrodrone,
    });

    const racedayquadsListing = await models.Listing.create({
      partId: part.id,
      vendor: "racedayquads",
      link: racedayquads,
    });

    // Create part prices
    await generatePrices(getfpvListing.id, "getfpv");
    await generatePrices(pyrodroneListing.id, "pyrodrone");
    await generatePrices(racedayquadsListing.id, "racedayquads");

    // Log progress
    console.log(`Part ${i}/${records.length}`);

    i += 1;
  }
};

const generateNumBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generatePrices = async (listingId, vendor) => {
  // Define parameters
  const count = 100;
  const minPrice = 5;
  const maxPrice = 100;

  // Generate seed price
  const seed = generateNumBetween(minPrice, maxPrice);

  // Generate list of prices based off seed
  const prices = Array.from(Array(count)).map(() =>
    generateNumBetween(seed - 5, seed + 5)
  );

  // Save prices to database
  await Promise.all(
    prices.map(async (value, i) => {
      // Generate date
      let date = dayjs().subtract(count - i, "day");
      date = date.format("YYYY-MM-DD");

      // Generate uuid base on listing ID, date and vendor
      const id = uuidv5(`${listingId}${date}${vendor}`, config.namespace);

      // Create price
      await models.Price.create({ id, value, date, listingId });
    })
  );
};

export default seedParts;
