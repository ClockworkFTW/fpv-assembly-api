const getPriceModel = (sequelize, { DataTypes }) => {
  const Price = sequelize.define("price", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Price.associate = (models) => {
    Price.belongsTo(models.Listing);
  };

  return Price;
};

export default getPriceModel;
