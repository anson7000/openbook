import express, { type Express, type Request, type Response } from "express";

const app: Express = express();

app.get("/", (_: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  let message = "Server running on http://localhost:3000";
  console.log(message);
});
