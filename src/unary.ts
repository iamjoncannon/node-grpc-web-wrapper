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
      response: string,
      trailers: grpc.Metadata | undefined,
      // todo- handle flags
      flags: number | undefined
    ) => {
      if (!!error) {
        respondWithStatus(
          res,
          error.code ?? grpc.status.UNKNOWN,
          error.details ?? "unknown error"
        );
        return;
      }

      const serialized = serializeMessage(handler, response);

      res.write(serialized);

      const responseTrailers = getSerializedOkTrailers(
        trailers ?? new grpc.Metadata()
      );

      res.end(responseTrailers);
    }
  );
};

export default handleUnary;
