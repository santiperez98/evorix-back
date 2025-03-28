const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");
const Role = require("./Role");

const UserRole = sequelize.define("UserRole", {});

// Relaciones
User.belongsToMany(Role, { through: UserRole });
Role.belongsToMany(User, { through: UserRole });

module.exports = UserRole;
