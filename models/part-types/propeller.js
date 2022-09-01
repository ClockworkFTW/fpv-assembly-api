const getPropellerModel = (sequelize, { DataTypes }) => {
  const Propeller = sequelize.define("propeller", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    diameter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    pitchAngle: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    bladeCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    shaftDiameter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Propeller.associate = (models) => {
    Propeller.belongsTo(models.Part);
  };

  return Propeller;
};

export default getPropellerModel;
