const getListingModel = (sequelize, { DataTypes }) => {
  const Listing = sequelize.define("listing", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    vendor: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Listing.associate = (models) => {
    Listing.belongsTo(models.Part);
    Listing.hasMany(models.Price);
  };

  return Listing;
};

export default getListingModel;
