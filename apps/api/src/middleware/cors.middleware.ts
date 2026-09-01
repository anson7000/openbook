import cors from "cors";
import { env } from "@/config/env.js";

const corsOptions = {
  origin:
    env.nodeEnv === "development"
      ? "http://localhost:5173"
      : "https://cheat-sheet-generator-web.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
};

export const corsMiddleware = cors(corsOptions);
