const getCommentChildModel = (sequelize, { DataTypes }) => {
  const CommentChild = sequelize.define(
    "comment_child",
    {},
    { timestamps: false }
  );

  return CommentChild;
};

export default getCommentChildModel;
