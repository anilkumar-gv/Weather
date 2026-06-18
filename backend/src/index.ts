import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.js";
import locationRoutes from "./routes/location.js";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.use("/api", chatRoutes);
app.use("/api", locationRoutes);

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});
