const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgres");
const User = require("./User");

const Student = sequelize.define("Student", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false }
});

// A parent has many children
User.hasMany(Student, { foreignKey: "parentId", as: "children" });
Student.belongsTo(User, { foreignKey: "parentId", as: "parent" });

module.exports = Student;
