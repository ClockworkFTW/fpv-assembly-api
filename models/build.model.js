const getBuildModel = (sequelize, { DataTypes }) => {
  const Build = sequelize.define("build", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    markdown: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Build.associate = (models) => {
    Build.belongsTo(models.User);
    Build.belongsToMany(models.Part, { through: models.BuildPart });
    Build.belongsToMany(models.Image, { through: models.BuildImage });
  };

  return Build;
};

export default getBuildModel;
