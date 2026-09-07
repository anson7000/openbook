import cors from "cors";
import { env } from "../config/env.js";

const allowedOrigins = [];

switch (env.nodeEnv) {
  case "production":
    allowedOrigins.push("https://openbook-web.vercel.app");
    break;
  case "preview":
    // Change this to your preview deployment URL
    allowedOrigins.push("https://openbook-web-git-preview-ansonl.github.io");
    break;
  default:
    allowedOrigins.push("http://localhost:5173");
    break;
}

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
};

export const corsMiddleware = cors(corsOptions);
