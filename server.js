import express from "express";
import cors from "cors";
import chatRoutes from "./src/routes/chat.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "64kb" }));

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "chat-backend" });
});

app.use("/api", chatRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[server] jalan di port ${PORT}`);
});
