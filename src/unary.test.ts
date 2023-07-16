import * as grpc from "@grpc/grpc-js";
import { UnaryHandler } from "@grpc/grpc-js/build/src/server-call";
import { serializeMessage } from "./serialize";
import { getSerializedOkTrailers, respondWithStatus } from "./trailers";
import { GrcpServerUnaryCallImpl } from "./types";
import handleUnary from "./unary";

jest.mock("./serialize");
const serializeMessageMock = serializeMessage as jest.Mock;

jest.mock("./trailers");
const getSerializedOkTrailersMock = getSerializedOkTrailers as jest.Mock;
const respondWithStatusMock = respondWithStatus as jest.Mock;

describe("unary handler", () => {
  const response = "response";
  const res = {
    write: jest.fn(),
    end: jest.fn(),
  } as unknown as GrcpServerUnaryCallImpl;

  const mockReturnValue = "mockReturnValue";

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should invoke unaryhandler func", () => {
    const error = null;

    serializeMessageMock.mockReturnValue(mockReturnValue);
    getSerializedOkTrailersMock.mockReturnValue(mockReturnValue);

    const func = (_res: unknown, cb: grpc.sendUnaryData<any>) =>
      cb(error, response);

    const handler = {
      func,
      deserialize: jest.fn(),
      serialize: jest.fn(),
    } as unknown as UnaryHandler<any, any>;

    handleUnary(handler, Buffer.from("buffer"), res);

    expect(serializeMessageMock).toHaveBeenCalledWith(handler, response);
    expect(res.write).toHaveBeenCalledWith(mockReturnValue);
    expect(res.end).toHaveBeenCalledWith(mockReturnValue);
  });

  it("should handle trailers propagated from caller", () => {
    const error = null;

    const trailers = new grpc.Metadata();

    serializeMessageMock.mockReturnValue(mockReturnValue);
    getSerializedOkTrailersMock.mockReturnValue(mockReturnValue);

    const func = (_res: unknown, cb: grpc.sendUnaryData<any>) =>
      cb(error, response, trailers);

    const handler = {
      func,
      deserialize: jest.fn(),
      serialize: jest.fn(),
    } as unknown as UnaryHandler<any, any>;

    handleUnary(handler, Buffer.from("buffer"), res);

    expect(serializeMessageMock).toHaveBeenCalledWith(handler, response);
    expect(res.write).toHaveBeenCalledWith(mockReturnValue);
    expect(res.end).toHaveBeenCalledWith(mockReturnValue);
  });

  it("should handle error propagated from caller", () => {
    const statusBuilder = new grpc.StatusBuilder();
    const code = 0;
    const details = "fubar";
    const error = statusBuilder.withCode(code).withDetails(details).build();

    serializeMessageMock.mockReturnValue(mockReturnValue);
    getSerializedOkTrailersMock.mockReturnValue(mockReturnValue);

    const func = (_res: unknown, cb: grpc.sendUnaryData<any>) =>
      cb(error, response);

    const handler = {
      func,
      deserialize: jest.fn(),
      serialize: jest.fn(),
    } as unknown as UnaryHandler<any, any>;

    handleUnary(handler, Buffer.from("buffer"), res);

    expect(serializeMessageMock).not.toHaveBeenCalled();
    expect(respondWithStatusMock).toHaveBeenCalledWith(res, code, details);
  });

  it("handles errors with blank code and details", () => {
    const statusBuilder = new grpc.StatusBuilder();
    const error = statusBuilder.build();

    serializeMessageMock.mockReturnValue(mockReturnValue);
    getSerializedOkTrailersMock.mockReturnValue(mockReturnValue);

    const func = (_res: unknown, cb: grpc.sendUnaryData<any>) =>
      cb(error, response);

    const handler = {
      func,
      deserialize: jest.fn(),
      serialize: jest.fn(),
    } as unknown as UnaryHandler<any, any>;

    handleUnary(handler, Buffer.from("buffer"), res);

    expect(serializeMessageMock).not.toHaveBeenCalled();
    expect(respondWithStatusMock).toHaveBeenCalledWith(res, 2, "unknown error");
  });
});
