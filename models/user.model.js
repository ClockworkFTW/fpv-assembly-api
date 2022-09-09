export const ssoProviders = {
  GOOGLE: "google",
  FACEBOOK: "facebook",
  APPLE: "apple",
};

const getUserModel = (sequelize, { DataTypes }) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ssoId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    ssoProvider: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
        isIn: [Object.values(ssoProviders)],
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "USER",
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Build, { onDelete: "CASCADE" });
    User.hasMany(models.Review, { onDelete: "CASCADE" });
  };

  return User;
};

export default getUserModel;
