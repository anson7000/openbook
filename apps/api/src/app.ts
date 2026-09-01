import express, { type Express, type Request, type Response } from "express";
import cors from "cors";

const app: Express = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400,
  }),
);

app.get("/", (_: Request, res: Response) => {
  res.send("Hello World! api");
});

app.get("/api/data", (_: Request, res: Response) => {
  res.json({ message: "Hello from the API!" });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
