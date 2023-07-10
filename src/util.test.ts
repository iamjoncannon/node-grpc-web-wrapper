import * as http from "http";
import { GrcpServerCallImpl } from "./types";
import { isInvalidVerb } from "./util";

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
