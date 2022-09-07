const getReviewModel = (sequelize, { DataTypes }) => {
  const Review = sequelize.define("review", {
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Review.associate = (models) => {
    Review.belongsTo(models.User);
    Review.belongsTo(models.Part);
  };

  return Review;
};

export default getReviewModel;
