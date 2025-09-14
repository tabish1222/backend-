const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");

const Student = sequelize.define("Student", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  grade: { type: DataTypes.STRING, allowNull: false },
});

Student.belongsTo(User, { as: "parent", foreignKey: "parentId" });
User.hasMany(Student, { as: "children", foreignKey: "parentId" });

module.exports = Student;
