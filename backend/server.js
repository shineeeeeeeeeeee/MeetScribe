import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import path from "path";
import fs from "fs";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import savedRoutes from "./routes/savedRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

import chatbotRoute from "./routes/chatbot.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

// CORS globally
// NOTE: the Vite dev server auto-increments its port (5173 -> 5174 -> 5175 ...)
// when the default port is busy, so the allowed origin CANNOT be hard-coded to a
// single port. Every localhost / 127.0.0.1 dev origin is accepted, and extra
// origins (e.g. a deployed frontend) can be added through ALLOWED_ORIGINS.
const EXTRA_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

const LOCAL_DEV_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const corsOptions = {
    origin(origin, callback) {
        // No Origin header -> same-origin request, curl, or native app
        if (!origin) return callback(null, true);
        if (LOCAL_DEV_ORIGIN.test(origin) || EXTRA_ORIGINS.includes(origin)) {
            return callback(null, true);
        }
        console.error(`CORS blocked request from origin: ${origin}`);
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(cors(corsOptions));
// handle preflight requests
app.options("*", cors(corsOptions));

// middleware to parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// static files (uploads)
app.use(
  "/uploads",
  cors(corsOptions),
  express.static(path.join(process.cwd(), "uploads"))
);

const uploadDirs = [
    "uploads/resumes",
    "uploads/company/logos",
    "uploads/company/docs"
];
uploadDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

app.use("/api/users", userRoutes); // for chatbot

app.use("/api/applications", applicationRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/review", reviewRoutes);

// test route
app.get("/", (req, res) => res.send("Backend running successfully"));

// chatbot test
app.use(express.json());
app.use("/api/chatbot", chatbotRoute);

// start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));