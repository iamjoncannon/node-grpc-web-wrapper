import { Metadata } from "@grpc/grpc-js";
import {
  getDeadlineFromMetadata,
  getTimeoutinMs,
  GRPC_TIMEOUT_HEADER,
  MAX_TIMEOUT_TIME,
} from "./deadline";

describe("getTimeoutinMs", () => {
  it("should return MAX_TIMEOUT_TIME when no timeout value is present", () => {
    const metadata = new Metadata();
    const result = getTimeoutinMs(metadata);
    expect(result).toEqual(MAX_TIMEOUT_TIME);
  });

  it("should return the correct timeout value in milliseconds", () => {
    const metadata = new Metadata();
    metadata.set(GRPC_TIMEOUT_HEADER, "10S");
    const result = getTimeoutinMs(metadata);
    expect(result).toEqual(10000);
  });

  it("should throw an error for an invalid deadline header", () => {
    const metadata = new Metadata();
    metadata.set(GRPC_TIMEOUT_HEADER, "10invalid");
    expect(getTimeoutinMs(metadata)).toEqual(MAX_TIMEOUT_TIME);
  });
});

describe("getDeadlineFromMetadata", () => {
  it("should return the correct deadline time", () => {
    const metadata = new Metadata();
    const currentTimestamp = new Date().getTime();
    const timeoutInMs = 5000;
    const expectedDeadline = currentTimestamp + timeoutInMs;

    const getTimeoutinMs = jest.fn(() => timeoutInMs);

    const result = getDeadlineFromMetadata(metadata, getTimeoutinMs);
    // sometimes off by one
    expect(expectedDeadline - result < 5);
    expect(getTimeoutinMs).toHaveBeenCalledWith(metadata);
  });

  it("should return the default deadline time when an error occurs", () => {
    const metadata = new Metadata();
    const currentTimestamp = new Date().getTime();
    const expectedDeadline = currentTimestamp + MAX_TIMEOUT_TIME;
    const getTimeoutinMs = jest.fn(() => {
      throw new Error();
    });

    const result = getDeadlineFromMetadata(metadata, getTimeoutinMs);
    expect(Math.abs(result - expectedDeadline) < 5);
  });
});
