import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import chatRoutes from "../src/routes/chat.js";
import { notFound, errorHandler } from "../src/middleware/errorHandler.js";

const app = express();

// Ganti URL di bawah dengan URL frontend kamu setelah di-deploy
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5500",
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      cb(new Error(`Origin tidak diizinkan: ${origin}`));
    },
  })
);

app.use(express.json({ limit: "64kb" }));

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "chat-backend" });
});

const chatLimiter = rateLimit({
  windowMs: 60_000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Terlalu banyak permintaan, coba lagi nanti" },
});

app.use("/api/chat", chatLimiter);

app.use("/api", chatRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
