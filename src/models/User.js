const { DataTypes } = require("sequelize");
const { sequelize } = require("../db"); // ✅ import the ORM instance

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("parent", "teacher"), allowNull: false },
});

module.exports = User;
