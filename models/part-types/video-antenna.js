const getVideoAntennaModel = (sequelize, { DataTypes }) => {
  const VideoAntenna = sequelize.define("video_antenna", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    minFrequency: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    maxFrequency: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    gain: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    length: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    connector: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  VideoAntenna.associate = (models) => {
    VideoAntenna.belongsTo(models.Part);
  };

  return VideoAntenna;
};

export default getVideoAntennaModel;
