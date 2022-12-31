import Busboy from "busboy";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const upload = (folder) => async (req, res, next) => {
  const busboy = Busboy({ headers: req.headers });

  const fileSize = parseInt(req.headers["content-length"]) / 1024 / 1024;

  busboy.on("field", (name, value, info) => {
    if (name === "fileCount" && fileSize / value > 2) {
      const message = "One or more files are too large";
      return res.status(400).send({ message });
    }
  });

  const files = [];

  busboy.on("file", (name, file, info) => {
    const validFileType =
      info.mimeType === "image/jpeg" ||
      info.mimeType === "image/jpg" ||
      info.mimeType == "image/png";

    if (!validFileType) {
      const message = "One or more file types are invalid";
      return res.status(400).send({ message });
    }

    const chunks = [];

    file.on("data", (data) => {
      chunks.push(data);
    });

    file.on("end", () => {
      const buffer = Buffer.concat(chunks);
      const key = `${folder}/${uuidv4()}.webp`;
      files.push(compressImage(buffer, key));
    });
  });

  busboy.on("finish", async () => {
    req.files = await Promise.all(files);
    next();
  });

  req.pipe(busboy);
};

const compressImage = async (buffer, key) => {
  const body = await sharp(buffer).webp({ quality: 50 }).toBuffer();
  return { body, key };
};

export default upload;
