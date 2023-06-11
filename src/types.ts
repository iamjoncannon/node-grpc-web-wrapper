import * as http from "http";
import grpc from "@grpc/grpc-js";
import {
  ServerStreamingHandler,
  ServerUnaryCallImpl,
  ServerWritableStream,
  UnaryHandler,
} from "@grpc/grpc-js/build/src/server-call";

export type GrcpServerUnaryCallImpl = ServerUnaryCallImpl<any, any> &
  http.ServerResponse<http.IncomingMessage>;

export type GrpcServerWritableStream = ServerWritableStream<any, any> &
  http.ServerResponse<http.IncomingMessage>;

export type GrcpServerCallImpl =
  | GrcpServerUnaryCallImpl
  | GrpcServerWritableStream;

export type GrpcWebHandler =
  | UnaryHandler<any, any>
  | ServerStreamingHandler<any, any>;

export type GrpcWebWrapper = (
  server2: grpc.Server,
  options?: GrpcWebWrapperOptions
) => http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

export interface GrpcWebWrapperOptions {
  cors?: string;
}
