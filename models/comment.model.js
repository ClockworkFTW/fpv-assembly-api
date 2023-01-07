const getCommentModel = (sequelize, { DataTypes }) => {
  const Comment = sequelize.define("comment", {
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
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User);
    Comment.belongsTo(models.Build);
    Comment.belongsTo(models.Comment, { foreignKey: "parentId" });
    Comment.belongsToMany(models.Comment, {
      as: "children",
      through: models.CommentChild,
    });
    Comment.hasMany(models.CommentVote, { onDelete: "CASCADE" });
  };

  return Comment;
};

export default getCommentModel;
