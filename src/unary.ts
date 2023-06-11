import * as grpc from "@grpc/grpc-js";
import { getSerializedOkTrailers, respondWithStatus } from "./trailers";
import { serializeMessage } from "./serialize";
import { UnaryHandler } from "@grpc/grpc-js/build/src/server-call";
import { GrcpServerUnaryCallImpl } from "./types";

const handleUnary = (
  handler: UnaryHandler<any, any>,
  buffer: Buffer,
  res: GrcpServerUnaryCallImpl
) => {
  res.request = handler.deserialize(buffer.slice(5)) as unknown;

  (handler as UnaryHandler<any, any>).func(
    res,
    (
      error: grpc.ServerErrorResponse | Partial<grpc.StatusObject> | null,
      response: any,
      trailers: grpc.Metadata | undefined,
      flags: number | undefined // ?
    ) => {
      if (!!error) {
        respondWithStatus(
          res,
          error.code ?? grpc.status.UNKNOWN,
          error.details ?? ""
        );
        return;
      }

      const serialized = serializeMessage(handler, response);

      res.write(serialized);

      res.end(getSerializedOkTrailers(trailers ?? new grpc.Metadata()));
    }
  );
};

export default handleUnary;
