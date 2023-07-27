import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition } from "@grpc/grpc-js";
import * as grpc from "@grpc/grpc-js";
import { ProtoGrpcType } from "../protobuf/Chat";
import ChatService from "./ChatService";
import path from "path";

export const createGrpcServer = () => {
  const parent = path.resolve(__dirname, "..");

  const protoFileName = path.join(parent + "/protobuf/Chat.proto");

  const packageDefinition = loadSync(protoFileName, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const packageObject = loadPackageDefinition(
    packageDefinition
  ) as unknown as ProtoGrpcType;

  const chatPackage = packageObject.chat;

  const server = new grpc.Server();

  const chatService = new ChatService();

  server.addService(chatPackage.ChatService.service, chatService.services());

  return server;
};
