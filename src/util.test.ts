import * as http from "http";
import { GrcpServerCallImpl } from "./types";
import {
  isInvalidVerb,
  setServerSurfaceCallMethods,
  setTimeoutDeadline,
} from "./util";
import * as grpc from "@grpc/grpc-js";
import { getSerializedMetadata } from "./trailers";
import { GRPC_TIMEOUT_HEADER } from "./deadline";

describe("isInvalidVerb", () => {
  const res = {
    writeHead: jest.fn(),
    end: jest.fn(),
  } as unknown as GrcpServerCallImpl;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns true if very isnt get or post", () => {
    const req = { method: "NOT GET OR POST" } as http.IncomingMessage;
    const result = isInvalidVerb(req, res);
    expect(result).toEqual(true);
  });

  it("returns false if get", () => {
    const req = { method: "GET" } as http.IncomingMessage;
    const result = isInvalidVerb(req, res);
    expect(result).toEqual(false);
  });

  it("returns false if post", () => {
    const req = { method: "POST" } as http.IncomingMessage;
    const result = isInvalidVerb(req, res);
    expect(result).toEqual(false);
  });

  it("handles invalid req method", () => {
    const req = {} as http.IncomingMessage;
    const result = isInvalidVerb(req, res);
    expect(result).toEqual(true);
  });
});

describe("setServerSurfaceCallMethods implements ServerSurfaceCall methods", () => {
  describe("sendMetadata", () => {
    it("writes metadata to response", () => {
      const res = {
        write: jest.fn(),
      } as unknown as GrcpServerCallImpl;

      const md = new grpc.Metadata();

      md.set("test", "test");

      setServerSurfaceCallMethods(res);
      res.sendMetadata(md);

      expect(res.write).toBeCalledWith(getSerializedMetadata(md));
    });

    it("catches errors", () => {
      const res = {
        write: jest.fn(),
      } as unknown as GrcpServerCallImpl;

      const md = "not an md" as unknown as grpc.Metadata;

      console.error = jest.fn();
      setServerSurfaceCallMethods(res);
      res.sendMetadata(md);

      expect(console.error).toHaveBeenCalledWith(
        "TypeError: metadata.getMap is not a function"
      );
    });
  });

  it("getDeadline sets deadline from current res metadata", () => {
    const metadata = new grpc.Metadata();
    metadata.set(GRPC_TIMEOUT_HEADER, "2m");

    const res = { metadata } as unknown as GrcpServerCallImpl;

    setServerSurfaceCallMethods(res);

    const deadline = res.getDeadline() as number;

    expect(deadline < Math.abs(new Date().getTime()) + 3);
  });

  it("getPeer and getPath should return url", () => {
    const url = "url";

    const res = { req: { url } } as unknown as GrcpServerCallImpl;

    setServerSurfaceCallMethods(res);

    expect(res.getPeer()).toEqual(url);
    expect(res.getPath()).toEqual(url);
  });

  it("getPeer and getPath handle nulls", () => {
    const res = { req: {} } as unknown as GrcpServerCallImpl;

    setServerSurfaceCallMethods(res);

    expect(res.getPeer()).toEqual("");
    expect(res.getPath()).toEqual("");
  });
});

describe("setTimeoutDeadline", () => {
  it("should call setTzimeout with the res metadata timeout", () => {
    const metadata = new grpc.Metadata();
    metadata.set(GRPC_TIMEOUT_HEADER, "2m");

    const res = {
      write: jest.fn(),
      end: jest.fn(),
      metadata,
    } as unknown as GrcpServerCallImpl;

    const _setTimeout = (cb: () => void, timeout: number) => cb();

    setTimeoutDeadline(res, _setTimeout as unknown as typeof setTimeout);

    const endCall = Buffer.from(
      (res.end as jest.Mock).mock.calls[0][0],
      "base64"
    ).toString();

    expect(endCall.includes("grpc-message:deadline%20exceeded:%202ms"));
  });
});
