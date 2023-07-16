import { serializeTrailers } from "./serialize";
import * as grpc from "@grpc/grpc-js";
import {
  getSerializedOkTrailers,
  processStatusObjectForSerialization,
  respondWithStatus,
} from "./trailers";
import { GrcpServerCallImpl } from "./types";

jest.mock("./serialize");
const serializeTrailersMock = serializeTrailers as jest.Mock;

describe("trailer utils", () => {
  beforeEach(() => {
    serializeTrailersMock.mockReset();
  });

  describe("getSerializedOkTrailers", () => {
    it("should respond with ok", () => {
      const md = new grpc.Metadata();

      getSerializedOkTrailers(md);

      const call = serializeTrailersMock.mock.calls[0][0];

      expect(call.includes("grpc-status:0"));
      expect(call.includes("grpc-message:ok"));
    });
  });

  describe("respondWithStatus", () => {
    it("should respond with grpc status code", () => {
      const res = { end: jest.fn() } as unknown as GrcpServerCallImpl;
      const code = 4 as grpc.status;
      respondWithStatus(res, code, "5x5");

      const call = serializeTrailersMock.mock.calls[0][0];

      expect(call.includes("grpc-status:4"));
      expect(call.includes("grpc-message:5x5"));
    });

    it("should have default blank message", () => {
      const res = { end: jest.fn() } as unknown as GrcpServerCallImpl;
      const code = 4 as grpc.status;
      respondWithStatus(res, code, undefined);

      const call = serializeTrailersMock.mock.calls[0][0];

      expect(call.includes("grpc-status:4"));
      expect(call.includes("grpc-message:"));
    });
  });

  describe("processStatusObjectForSerialization", () => {
    it("should generate serializable object from grpc status object", () => {
      const statusBuilder = new grpc.StatusBuilder();
      const status = statusBuilder.withCode(1).withDetails("5by5").build();

      const result = processStatusObjectForSerialization(status);

      expect(result).toEqual({ "grpc-message": "5by5", "grpc-status": "1" });
    });

    it("should handle null values on grpc status", () => {
      const statusBuilder = new grpc.StatusBuilder();
      const status = statusBuilder.build();

      const result = processStatusObjectForSerialization(status);

      expect(result).toEqual({ "grpc-message": "", "grpc-status": "0" });
    });
  });
});
