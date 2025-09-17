import { User } from "./User.js";
import { Student } from "./Student.js";
import { Subject } from "./Subject.js";
import { StudentTeacher } from "./StudentTeacher.js";

// Parent ↔ Student
User.hasMany(Student, { foreignKey: "parent_id", as: "children" });
Student.belongsTo(User, { foreignKey: "parent_id", as: "parent" });

// Teacher ↔ Student (many-to-many through StudentTeacher)
User.belongsToMany(Student, {
  through: StudentTeacher,
  foreignKey: "teacher_id",
  as: "students",
});
Student.belongsToMany(User, {
  through: StudentTeacher,
  foreignKey: "student_id",
  as: "teachers",
});

// TeacherSubject ↔ Subject
Subject.hasMany(StudentTeacher, { foreignKey: "subject_id" });
StudentTeacher.belongsTo(Subject, { foreignKey: "subject_id" });
