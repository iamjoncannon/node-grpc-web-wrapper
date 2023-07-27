/* istanbul ignore file */

import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition } from "@grpc/grpc-js";
import * as grpc from "@grpc/grpc-js";
import { ProtoGrpcType } from "./proto/helloworld";
import { GreeterHandlers } from "./proto/helloworld/Greeter";
import { doSayHello, doSayRepeatHello } from "./serviceImpl";
import path from "path";

export const getMockGrpcService = () => {
  const protoFileName = path.join(__dirname + "/proto/helloworld.proto");

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

  const helloworldPackage = packageObject.helloworld;

  const server = new grpc.Server();

  const greeterService: GreeterHandlers = {
    SayHello: doSayHello,
    SayRepeatHello: doSayRepeatHello,
  };

  server.addService(helloworldPackage.Greeter.service, greeterService);

  return server;
};
