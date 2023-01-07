const getCommentVoteModel = (sequelize, { DataTypes }) => {
  const CommentVote = sequelize.define("comment_vote", {
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

  CommentVote.associate = (models) => {
    CommentVote.belongsTo(models.User);
    CommentVote.belongsTo(models.Comment);
  };

  return CommentVote;
};

export default getCommentVoteModel;
