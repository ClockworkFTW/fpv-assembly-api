const getPriceModel = (sequelize, { DataTypes }) => {
  const Price = sequelize.define(
    "price",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      value: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    { timestamps: false }
  );

  Price.associate = (models) => {
    Price.belongsTo(models.Listing);
  };

  return Price;
};

export default getPriceModel;
