import * as grpc from "@grpc/grpc-js";
import { ServerStreamingHandler } from "@grpc/grpc-js/build/src/server-call";
import { serializeMessage } from "./serialize";
import { getSerializedOkTrailers, respondWithStatus } from "./trailers";
import { GrpcServerWritableStream } from "./types";

export const endWithErrorHandling = (
  res: GrpcServerWritableStream,
  metadata: grpc.Metadata
) => {
  try {
    res.write(getSerializedOkTrailers(metadata));
    res.end();
  } catch (err) {
    console.error(err);
    respondWithStatus(res, grpc.status.UNKNOWN, String(err));
  }
};

// see grpc-web GrpcWebClientReadableStream
export const handleServerStream = (
  handler: ServerStreamingHandler<unknown, unknown>,
  buffer: Buffer,
  res: GrpcServerWritableStream
) => {
  const request = handler.deserialize(buffer.slice(5));

  // https://grpc.github.io/grpc/node/grpc-ServerWritableStream.html
  const serverWritableStream = {
    ...res,
    // todo- set when client calls stream.cancel()
    cancelled: false,
    write: (val: string) => res.write(serializeMessage(handler, val)),
    end: (metadata: grpc.Metadata | undefined) => {
      // istanbul ignore next
      endWithErrorHandling(res, metadata ?? new grpc.Metadata());
    },
    request,
  } as unknown as grpc.ServerWritableStream<any, any>;

  handler.func(serverWritableStream);
};
