import "dotenv/config";
import cors from "cors";
import express from "express";
import { aiRouter } from "./routes/ai";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/ai", aiRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`AI proxy server listening on http://localhost:${port}`);
});
