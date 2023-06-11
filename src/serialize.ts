import { GrpcWebHandler } from "./types";

// see grpc-js Http2ServerCallStream serializeMessage
export const serialize = (messageBuffer: Buffer, headerByte: number) => {
  const byteLength = messageBuffer.byteLength;
  const output = Buffer.allocUnsafe(byteLength + 5);
  output.writeUInt8(headerByte, 0);
  output.writeUInt32BE(byteLength, 1);
  messageBuffer.copy(output, 5);
  return output.toString("base64");
};

export const serializeTrailers = (trailers: string) => {
  const messageBuffer = Buffer.from(trailers);
  const headerByte = 128;
  return serialize(messageBuffer, headerByte);
};

export const serializeMessage = (handler: GrpcWebHandler, value: string) => {
  const messageBuffer = handler.serialize(value);
  const headerByte = 0;
  return serialize(messageBuffer, headerByte);
};
