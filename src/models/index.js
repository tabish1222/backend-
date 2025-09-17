// src/models/index.js
import { User } from "./User.js";
import { Student } from "./Student.js";

// Define associations
User.hasMany(Student, { foreignKey: "parent_id", as: "children" });
Student.belongsTo(User, { foreignKey: "parent_id", as: "parent" });

export { User, Student };
