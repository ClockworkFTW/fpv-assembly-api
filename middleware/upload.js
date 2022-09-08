import Busboy from "busboy";
import { v4 as uuidv4 } from "uuid";

const upload = (folder) => async (req, res, next) => {
  const fileSize = parseInt(req.headers["content-length"]) / 1024 / 1024;

  if (fileSize > 2) {
    return res.status(400).send({ message: "File too large" });
  }

  const busboy = Busboy({ headers: req.headers });

  let chunks = [];
  let destination = null;

  busboy.on("file", (name, file, info) => {
    const validFileType =
      info.mimeType === "image/jpeg" ||
      info.mimeType === "image/jpg" ||
      info.mimeType == "image/png";

    if (!validFileType) {
      return res.status(400).send({ message: "Incorrect file type" });
    }

    const fileType = info.mimeType.split("/")[1];
    destination = `${folder}/${uuidv4()}.${fileType}`;

    file.on("data", (data) => {
      chunks.push(data);
    });
  });

  busboy.on("finish", async () => {
    const buffer = Buffer.concat(chunks);
    req.file = { buffer, destination };
    next();
  });

  req.pipe(busboy);
};

export default upload;
