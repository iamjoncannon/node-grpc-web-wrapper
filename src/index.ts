import * as http from "http";
import * as grpc from "@grpc/grpc-js";
import {
  getDeadlineFromMetadata,
  isInvalidVerb,
  isPreflight,
  setCorsHeader,
  setDefaultHeaders,
  setGrpcHeaders,
} from "./util";
import {
  GrcpServerCallImpl,
  GrcpServerUnaryCallImpl,
  GrpcServerWritableStream,
  GrpcWebHandler,
  GrpcWebWrapper,
  GrpcWebWrapperOptions,
} from "./types";
import { handleServerStream } from "./serverStream";
import { getMockGrpcService } from "./mock/server/service";
import handleUnary from "./unary";
import {
  ServerStreamingHandler,
  UnaryHandler,
} from "@grpc/grpc-js/build/src/server-call";
import { getSerializedMetadata, respondWithStatus } from "./trailers";

/**
 * Handles vaild grpc-web request with grpc.Server and
 * a generic node http.IncomingMessage.
 */
export const grpcWebHandler = (
  grpcServer: grpc.Server,
  req: http.IncomingMessage,
  res: GrcpServerCallImpl
) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      setGrpcHeaders(res);

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

      // ServerSurfaceCall properties
      res.sendMetadata = (responseMetadata: grpc.Metadata) =>
        res.write(getSerializedMetadata(responseMetadata));
      res.getPeer = () => res.req.url ?? "";
      res.getDeadline = () => getDeadlineFromMetadata(res.metadata);
      res.getPath = () => res.req.url ?? "";

      // if theres a timeout, set a timeout to cancel the stream
      // see /grpc-node/packages/grpc-js/src/deadline.ts

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
  });
};

/**
 * standalone grpc web server
 */
const GrpcWebServer: GrpcWebWrapper = (
  grpcServer: grpc.Server,
  options?: GrpcWebWrapperOptions
) => {
  if (!options) {
    console.log("grpc web starting- no cors set");
  }

  const nodeServer = http.createServer();

  nodeServer.on(
    "request",
    (req: http.IncomingMessage, res: GrcpServerCallImpl) => {
      setDefaultHeaders(res);

      if (options?.cors) {
        setCorsHeader(res, options?.cors);
      }

      if (isPreflight(req, res)) return;
      if (isInvalidVerb(req, res)) return;

      grpcWebHandler(grpcServer, req, res);
    }
  );

  return nodeServer;
};

if (require.main === module) {
  const mockService = getMockGrpcService();

  GrpcWebServer(mockService, { cors: "*" }).listen(1337, () => {
    console.log("started test service");
  });
}

export default GrpcWebServer;
