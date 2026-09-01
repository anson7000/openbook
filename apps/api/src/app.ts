import "dotenv/config";
import "module-alias/register";
import express, { type Express, type Request, type Response } from "express";
import { corsMiddleware } from "@/middleware/cors.middleware.js";

const app: Express = express();

app.use(corsMiddleware);

app.get("/", (_: Request, res: Response) => {
  res.send("Hello World! api");
});

app.get("/api/data", (_: Request, res: Response) => {
  res.json({ message: "Hello from the API!" });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
