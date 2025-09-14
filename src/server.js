const express = require("express");
const cors = require("cors");
const sequelize = require("./config/postgres");
const connectMongo = require("./config/mongo");

const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/students", studentRoutes);

const PORT = process.env.PORT || 10000;

(async () => {
  try {
    await connectMongo();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Startup error:", err.message);
  }
})();
