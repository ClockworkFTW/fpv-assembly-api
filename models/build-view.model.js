const getBuildViewModel = (sequelize, { DataTypes }) => {
  const BuildView = sequelize.define("build_view", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  BuildView.associate = (models) => {
    BuildView.belongsTo(models.Build);
  };

  return BuildView;
};

export default getBuildViewModel;
