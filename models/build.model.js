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
    log: {
      type: DataTypes.JSON,
      defaultValue: [
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ],
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
    Build.hasMany(models.Comment, { onDelete: "CASCADE" });
  };

  return Build;
};

export default getBuildModel;
