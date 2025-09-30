const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// ✅ Allowed origins (add more if needed)
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://task-front-rouge.vercel.app", // Vercel frontend
];

// ✅ Dynamic CORS config
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"), false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

// ✅ Routes
const authRoutes = require("./routes/authroute");
const taskRoutes = require("./routes/taskroute");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ✅ Environment checks
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not defined in .env");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET not defined in .env");
  process.exit(1);
}

// ✅ DB + Server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Connected to MongoDB");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => console.error("❌ MongoDB connection error:", err));
