// src/models/StudentTeacher.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const StudentTeacher = sequelize.define("StudentTeacher", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Subjects", key: "id" },
  },
});
