const getBuildCommentModel = (sequelize, { DataTypes }) => {
  const BuildComment = sequelize.define("build_comment", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  BuildComment.associate = (models) => {
    BuildComment.belongsTo(models.User);
    BuildComment.belongsTo(models.Build);
    BuildComment.hasMany(models.BuildCommentVote, { onDelete: "CASCADE" });
  };

  return BuildComment;
};

export default getBuildCommentModel;
