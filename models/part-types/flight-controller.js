const getFlightControllerModel = (sequelize, { DataTypes }) => {
  const FlightController = sequelize.define("flight_controller", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firmware: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    processor: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    stackMountWidth: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    stackMountLength: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  FlightController.associate = (models) => {
    FlightController.belongsTo(models.Part);
  };

  return FlightController;
};

export default getFlightControllerModel;
