const getBuildModel = (sequelize, { DataTypes }) => {
  const Build = sequelize.define("build", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    markdown: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Build.associate = (models) => {
    Build.belongsTo(models.User);
    Build.belongsToMany(models.Part, { through: models.BuildPart });
    Build.hasMany(models.Image, { onDelete: "CASCADE" });
  };

  return Build;
};

export default getBuildModel;
