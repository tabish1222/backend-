import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pgPool, connectMongo } from './db.js';

async function run() {
  await pgPool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    password_hash TEXT,
    role VARCHAR(20)
  );
  CREATE TABLE IF NOT EXISTS classes (class_id SERIAL PRIMARY KEY, name VARCHAR(50), teacher_id INT REFERENCES users(id));
  CREATE TABLE IF NOT EXISTS students (id SERIAL PRIMARY KEY, name VARCHAR(100), grade VARCHAR(10), class_id INT REFERENCES classes(class_id));
  CREATE TABLE IF NOT EXISTS parent_student (parent_id INT REFERENCES users(id), student_id INT REFERENCES students(id), PRIMARY KEY(parent_id, student_id));
  CREATE TABLE IF NOT EXISTS attendance (attendance_id SERIAL PRIMARY KEY, student_id INT REFERENCES students(id), date DATE NOT NULL, status VARCHAR(10), UNIQUE(student_id,date));
  `);

  // seed
  const tEmail = 'teacher@example.com';
  const pEmail = 'parent@example.com';
  const t = await pgPool.query('SELECT id FROM users WHERE email=$1', [tEmail]);
  if (t.rowCount === 0) {
    const thash = await bcrypt.hash('Passw0rd!', 10);
    const r = await pgPool.query('INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4) RETURNING id', ['Alice Teacher', tEmail, thash, 'teacher']);
    const teacherId = r.rows[0].id;
    const c = await pgPool.query('INSERT INTO classes(name, teacher_id) VALUES($1,$2) RETURNING class_id', ['10-A', teacherId]);
    const classId = c.rows[0].class_id;
    const s = await pgPool.query('INSERT INTO students(name, grade, class_id) VALUES($1,$2,$3) RETURNING id', ['Tabish', '10', classId]);
    const studentId = s.rows[0].id;
    const phash = await bcrypt.hash('ParentPass1!', 10);
    const pr = await pgPool.query('INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4) RETURNING id', ['Mr Parent', pEmail, phash, 'parent']);
    const parentId = pr.rows[0].id;
    await pgPool.query('INSERT INTO parent_student(parent_id, student_id) VALUES($1,$2)', [parentId, studentId]);
    console.log('Seeded teacher/parent/student.');
  } else {
    console.log('Seed already present.');
  }

  await connectMongo();
  const mongo = await connectMongo();
  // seed a feedback doc
  await mongo.collection('feedbacks').updateOne({ studentId: 1 }, { $setOnInsert: { studentId: 1, teacherId: 1, text: "Welcome!", date: new Date() } }, { upsert: true });

  console.log('Seed completed');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
