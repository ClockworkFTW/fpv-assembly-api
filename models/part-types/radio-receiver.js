const getRadioReceiverModel = (sequelize, { DataTypes }) => {
  const RadioReceiver = sequelize.define("radio_receiver", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    txProtocol: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    rxProtocol: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  RadioReceiver.associate = (models) => {
    RadioReceiver.belongsTo(models.Part);
  };

  return RadioReceiver;
};

export default getRadioReceiverModel;
