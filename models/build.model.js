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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Build.associate = (models) => {
    Build.belongsTo(models.User);
    Build.belongsToMany(models.Part, { through: "build_parts" });
    Build.hasMany(models.Image, { onDelete: "CASCADE" });
  };

  return Build;
};

export default getBuildModel;
