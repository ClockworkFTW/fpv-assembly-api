const getBuildImageModel = (sequelize, { DataTypes }) => {
  const BuildImage = sequelize.define(
    "build_image",
    {
      index: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    { timestamps: false }
  );

  return BuildImage;
};

export default getBuildImageModel;
