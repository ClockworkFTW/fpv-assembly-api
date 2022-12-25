import aws from "../config/aws.js";

const getImageModel = (sequelize, { DataTypes }) => {
  const Image = sequelize.define("image", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    bucket: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Image.afterDestroy(async (image) => {
    await aws.deleteFile(image.bucket, image.key);
  });

  Image.associate = (models) => {
    Image.belongsTo(models.User);
    Image.belongsToMany(models.Build, { through: models.BuildImage });
  };

  return Image;
};

export default getImageModel;
