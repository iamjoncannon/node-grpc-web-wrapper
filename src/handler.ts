import * as http from "http";
import * as grpc from "@grpc/grpc-js";
import {
  CONTENT_TYPE_HEADER,
  setGrpcHeaders,
  setServerSurfaceCallMethods,
  setTimeoutDeadline,
  WEB_TEXT_HEADER,
} from "./util";
import {
  GrcpServerCallImpl,
  GrcpServerUnaryCallImpl,
  GrpcServerWritableStream,
  GrpcWebHandler,
} from "./types";
import { handleServerStream } from "./serverStream";
import handleUnary from "./unary";
import {
  ServerStreamingHandler,
  UnaryHandler,
} from "@grpc/grpc-js/build/src/server-call";
import { respondWithStatus } from "./trailers";

export const _grpcWebHandler = (
  grpcServer: grpc.Server,
  req: http.IncomingMessage & { body?: unknown },
  res: GrcpServerCallImpl,
  body: string
) => {
  try {
    setGrpcHeaders(res);

    const protocol = req.headers[CONTENT_TYPE_HEADER];

    if (protocol !== WEB_TEXT_HEADER) {
      respondWithStatus(
        res,
        grpc.status.UNIMPLEMENTED,
        "binary wire format not implemented"
      );
      return;
    }

    const buffer = Buffer.from(body, "base64");

    // @ts-ignore -- handlers is a private member of grpc.Server
    const handler: GrpcWebHandler | undefined = grpcServer.handlers.get(
      req.url
    );

    if (!handler) {
      respondWithStatus(
        res,
        grpc.status.UNIMPLEMENTED,
        req.url + " not implemented"
      );
      return;
    }

    // @ts-ignore -- metadata is read only property of ServerCallImpl
    res.metadata = grpc.Metadata.fromHttp2Headers(req.headers);

    setServerSurfaceCallMethods(res);

    setTimeoutDeadline(res);

    if (handler.type === "unary") {
      handleUnary(
        handler as UnaryHandler<any, any>,
        buffer,
        res as GrcpServerUnaryCallImpl
      );
    }

    if (handler.type === "serverStream") {
      handleServerStream(
        handler as ServerStreamingHandler<any, any>,
        buffer,
        res as GrpcServerWritableStream
      );
    }

    return;
  } catch (err) {
    console.error({ err });
    respondWithStatus(res, grpc.status.UNKNOWN, "server error");
  }
};
