const getVideoTransmitterModel = (sequelize, { DataTypes }) => {
  const VideoTransmitter = sequelize.define("video_transmitter", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    transmission: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    frequency: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    minPowerLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    maxPowerLevel: {
      type: DataTypes.INTEGER,
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

  VideoTransmitter.associate = (models) => {
    VideoTransmitter.belongsTo(models.Part);
  };

  return VideoTransmitter;
};

export default getVideoTransmitterModel;
