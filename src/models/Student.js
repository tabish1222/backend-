// src/models/Student.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Student = sequelize.define("Student", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  class: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },
  parentId: { type: DataTypes.INTEGER, allowNull: false },
});
