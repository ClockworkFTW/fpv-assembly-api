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

  /**
   * Get one job
   */
  Part.getOne = async (models, partId) => {
    const partMeta = await Part.findByPk(partId, {
      raw: true,
    });

    const partSpecs = await models[partTypeToModel(partMeta.type)].findOne({
      attributes: { exclude: ["id", "partId", "createdAt", "updatedAt"] },
      where: { partId },
      raw: true,
    });

    return { ...partMeta, ...partSpecs };
  };

  /**
   * Get all jobs
   */
  Part.getAll = async (models, config = {}) => {
    const parts = await Part.findAll({
      ...config,
      attributes: ["id"],
      raw: true,
    });

    return await Promise.all(
      parts.map(async (part) => {
        return await Part.getOne(models, part.id);
      })
    );
  };

  Part.associate = (models) => {
    Part.hasMany(models.Price, { onDelete: "CASCADE" });
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
    Part.belongsToMany(models.Build, { through: "build_parts" });
  };

  return Part;
};

/**
 * Converts part type to sequelize model.
 *
 * @param {string} type The human readable type.
 * @return {string} type converted to model format.
 */
export const partTypeToModel = (type) => {
  let words = type.split(" ");
  words = words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
  return words.join("");
};

export default getPartModel;
