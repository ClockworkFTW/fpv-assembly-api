const getPartModel = (sequelize, { DataTypes }) => {
  const Part = sequelize.define("part", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Part.associate = (models) => {
    Part.hasMany(models.Price, { onDelete: "CASCADE" });
    Part.hasMany(models.Review, { onDelete: "CASCADE" });
    Part.hasOne(models.Motor, { onDelete: "CASCADE" });
    Part.hasOne(models.Frame, { onDelete: "CASCADE" });
    Part.hasOne(models.Battery, { onDelete: "CASCADE" });
    Part.hasOne(models.Propeller, { onDelete: "CASCADE" });
    Part.hasOne(models.RadioReceiver, { onDelete: "CASCADE" });
    Part.hasOne(models.VideoCamera, { onDelete: "CASCADE" });
    Part.hasOne(models.VideoAntenna, { onDelete: "CASCADE" });
    Part.hasOne(models.VideoTransmitter, { onDelete: "CASCADE" });
    Part.hasOne(models.FlightController, { onDelete: "CASCADE" });
    Part.hasOne(models.ElectronicSpeedController, { onDelete: "CASCADE" });
    Part.belongsToMany(models.Build, { through: models.BuildPart });
  };

  return Part;
};

export default getPartModel;
