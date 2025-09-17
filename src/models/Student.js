// src/models/Student.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import { User } from "./User.js"; // 🔹 import User for association

export const Student = sequelize.define("Student", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  class: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },

  // 🔹 rename to parent_id (convention) & allow null if needed
  parent_id: { 
    type: DataTypes.INTEGER,
    allowNull: true, // change from false → true to allow orphan students if needed
    references: { model: "Users", key: "id" }
  }
});

// 🔹 Association: Student belongs to a User (parent)
Student.belongsTo(User, { foreignKey: "parent_id", as: "parent" });

// 🔹 Association: A User (parent) has many Students
User.hasMany(Student, { foreignKey: "parent_id", as: "children" });
