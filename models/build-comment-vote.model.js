const getBuildCommentVoteModel = (sequelize, { DataTypes }) => {
  const BuildCommentVote = sequelize.define("build_comment_vote", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    vote: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  BuildCommentVote.associate = (models) => {
    BuildCommentVote.belongsTo(models.User);
    BuildCommentVote.belongsTo(models.BuildComment);
  };

  return BuildCommentVote;
};

export default getBuildCommentVoteModel;
