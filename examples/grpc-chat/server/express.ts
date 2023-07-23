import express from "express";
import cors from "cors";
import { createGrpcServer } from "./grpcService/server";
import { grpcWebHandler } from "node-grpc-web-wrapper";

const app = express();

app.use(cors());
const port = 3001;

const chatServer = createGrpcServer();

app.post("*", (req, res) => {
  grpcWebHandler(chatServer, req, res);
});

app.listen(port, () => {
  console.log(`express example running on port ${port}`);
});
