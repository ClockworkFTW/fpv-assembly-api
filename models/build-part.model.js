const getBuildPartModel = (sequelize, { DataTypes }) => {
  const BuildPart = sequelize.define(
    "build_part",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    { timestamps: false }
  );

  return BuildPart;
};

export default getBuildPartModel;
