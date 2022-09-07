const getBuildPartModel = (sequelize, { DataTypes }) => {
  const BuildPart = sequelize.define(
    "build_part",
    {
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
