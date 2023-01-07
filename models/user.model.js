export const roles = {
  user: "user",
  admin: "admin",
};

export const providers = {
  local: "local",
  google: "google",
  facebook: "facebook",
  apple: "apple",
};

const getUserModel = (sequelize, { DataTypes }) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
      defaultValue: roles.user,
      validate: {
        isIn: [Object.values(roles)],
      },
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: providers.local,
      validate: {
        isIn: [Object.values(providers)],
      },
    },
    activeBuildId: {
      type: DataTypes.UUID,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Build, { onDelete: "CASCADE" });
    User.hasMany(models.Comment, { onDelete: "CASCADE" });
    User.hasMany(models.CommentVote, { onDelete: "CASCADE" });
    User.hasMany(models.Image, { onDelete: "CASCADE" });
    User.hasMany(models.Review, { onDelete: "CASCADE" });
  };

  return User;
};

export default getUserModel;
