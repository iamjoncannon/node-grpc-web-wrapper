import * as http from "http";
import { GrcpServerCallImpl } from "./types";
import { isInvalidVerb } from "./util";

describe("isInvalidVerb", () => {
  it("returns false if very isnt get or post", () => {
    const req = { method: "NOT GET OR POST" } as http.IncomingMessage;
    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    } as unknown as GrcpServerCallImpl;
    const result = isInvalidVerb(req, res);

    expect(result).toEqual(true);
  });
});
