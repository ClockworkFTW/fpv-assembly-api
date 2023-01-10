const getBuildLikeModel = (sequelize, { DataTypes }) => {
  const BuildLike = sequelize.define("build_like", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  });

  BuildLike.associate = (models) => {
    BuildLike.belongsTo(models.User);
    BuildLike.belongsTo(models.Build);
  };

  return BuildLike;
};

export default getBuildLikeModel;
