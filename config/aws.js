import AWS from "aws-sdk";
import config from "./variables.js";

AWS.config.update({
  region: config.aws.region,
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
});

const S3 = new AWS.S3();

const uploadFile = async (body, key) => {
  const params = {
    Bucket: config.aws.bucket,
    Body: body,
    Key: key,
  };

  const data = await S3.upload(params).promise();

  return {
    tag: data.ETag,
    url: data.Location,
    bucket: data.Bucket,
    key: data.Key,
  };
};

const deleteFile = async (bucket, key) => {
  const params = { Bucket: bucket, Key: key };
  await S3.deleteObject(params).promise();
};

export default { uploadFile, deleteFile };
