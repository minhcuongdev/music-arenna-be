import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import { env } from "./configs/environments.";
import cors from "cors";
import http, { Server as ServerHTTP } from "http";

import questionRoute from "./routes/question.route";
import playlistRoute from "./routes/playlist.route";

import Socket from "./socket";

mongoose
  .connect(env.MONGODB_URI || process.env.MONGODB_URI || "")
  .then(() => {
    console.log("Connect to database successfully");
  })
  .then(() => {
    bootApp();
  })
  .catch((error) => {
    console.log("ERROR: ", error);
    process.exit(1);
  });

const bootApp = () => {
  const app: Express = express();
  const host = env.HOST || process.env.HOST;
  const port = env.PORT || process.env.PORT;

  app.use(express.json());
  app.use(cors());

  app.use("/api/questions", questionRoute);
  app.use("/api/playlist", playlistRoute);

  app.get("/", (req: Request, res: Response) => {
    res.send("Wellcom to Music Arena Server");
  });

  const server: ServerHTTP = http.createServer(app);

  Socket(server);

  server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at ${host}:${port}`);
  });
};
