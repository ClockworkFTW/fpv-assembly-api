const getElectronicSpeedControllerModel = (sequelize, { DataTypes }) => {
  const ElectronicSpeedController = sequelize.define(
    "electronic_speed_controller",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      individual: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      firmware: {
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
    }
  );

  ElectronicSpeedController.associate = (models) => {
    ElectronicSpeedController.belongsTo(models.Part);
  };

  return ElectronicSpeedController;
};

export default getElectronicSpeedControllerModel;
