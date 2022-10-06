import fs from "fs";
import { parse } from "csv-parse";
import { finished } from "stream/promises";

const options = { columns: true, bom: true };

const getRecords = async (filePath) => {
  const records = [];

  const parser = fs.createReadStream(filePath).pipe(parse(options));

  parser.on("readable", () => {
    let record;

    while ((record = parser.read()) !== null) {
      records.push(record);
    }
  });

  await finished(parser);

  return records;
};

export default { getRecords };
