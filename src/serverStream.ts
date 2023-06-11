import * as grpc from "@grpc/grpc-js";
import { ServerStreamingHandler } from "@grpc/grpc-js/build/src/server-call";
import { serializeMessage } from "./serialize";
import { getSerializedOkTrailers } from "./trailers";
import { GrpcServerWritableStream } from "./types";

// see grpc-web GrpcWebClientReadableStream
export const handleServerStream = (
  handler: ServerStreamingHandler<any, any>,
  buffer: Buffer,
  res: GrpcServerWritableStream
) => {
  const request = handler.deserialize(buffer.slice(5));

  // https://grpc.github.io/grpc/node/grpc-ServerWritableStream.html
  const serverWritableStream = {
    ...res,
    cancelled: false, // todo- how to set when client calls stream.cancel()
    write: (val: string) => res.write(serializeMessage(handler, val)),
    end: (metadata: grpc.Metadata) => {
      try {
        res.write(getSerializedOkTrailers(metadata));
        res.end();
      } catch (err) {
        console.error(err);
        res.end();
      }
    },
    request,
  } as unknown as grpc.ServerWritableStream<any, any>;

  handler.func(serverWritableStream);
};
