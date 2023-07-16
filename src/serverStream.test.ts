import { Metadata, status } from "@grpc/grpc-js";
import { endWithErrorHandling } from "./serverStream";
import { getSerializedOkTrailers, respondWithStatus } from "./trailers";
import { GrpcServerWritableStream } from "./types";

jest.mock("./trailers");
const getSerializedOkTrailersMock = getSerializedOkTrailers as jest.Mock;

describe("endWithErrorHandling", () => {
  let mockRes = {
    write: jest.fn(),
    end: jest.fn(),
  } as unknown as GrpcServerWritableStream;
  let mockMetadata: Metadata;

  beforeEach(() => {
    mockMetadata = new Metadata();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call res.write and res.end with serialized OK trailers", () => {
    const expectedSerializedOkTrailers = "serialized OK trailers";

    getSerializedOkTrailersMock.mockReturnValue(expectedSerializedOkTrailers);

    endWithErrorHandling(mockRes, mockMetadata);

    expect(getSerializedOkTrailers).toHaveBeenCalledWith(mockMetadata);
    expect(mockRes.write).toHaveBeenCalledWith(expectedSerializedOkTrailers);
    expect(mockRes.end).toHaveBeenCalled();
    expect(respondWithStatus).not.toHaveBeenCalled();
  });

  it("should call respondWithStatus when an error occurs", () => {
    const expectedError = new Error("Some error");

    getSerializedOkTrailersMock.mockImplementation(() => {
      throw expectedError;
    });

    endWithErrorHandling(mockRes, mockMetadata);

    expect(getSerializedOkTrailers).toHaveBeenCalledWith(mockMetadata);
    expect(mockRes.write).not.toHaveBeenCalled();
    expect(mockRes.end).not.toHaveBeenCalled();
    expect(respondWithStatus).toHaveBeenCalledWith(
      mockRes,
      status.UNKNOWN,
      String(expectedError)
    );
  });
});
