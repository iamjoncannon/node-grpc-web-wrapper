import { GrcpServerCallImpl } from "./types";
import * as http from "http";

export const CONTENT_TYPE_HEADER = "content-type";
export const WEB_TEXT_HEADER = "application/grpc-web-text";
export const BINARY_HEADER = "application/grpc-web+proto";

export const setDefaultHeaders = (res: GrcpServerCallImpl) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  res.setHeader("Access-Control-Max-Age", 2592000);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "keep-alive,user-agent,cache-control,content-type,content-transfer-encoding,custom-header-1,x-accept-content-transfer-encoding,x-accept-response-streaming,x-user-agent,x-grpc-web,grpc-timeout"
  );
};

export const setGrpcHeaders = (res: GrcpServerCallImpl) => {
  res.setHeader(
    "access-control-expose-headers",
    "custom-header-1,grpc-status,grpc-message"
  );
  res.setHeader(CONTENT_TYPE_HEADER, WEB_TEXT_HEADER);
  res.setHeader("grpc-accept-encoding", "identity");
  res.setHeader("grpc-encoding", "identity");
};

export const setCorsHeader = (res: GrcpServerCallImpl, corsOrigin: string) => {
  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
};

export const isPreflight = (
  req: http.IncomingMessage,
  res: GrcpServerCallImpl
) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return true;
  }

  return false;
};

export const isInvalidVerb = (
  req: http.IncomingMessage,
  res: GrcpServerCallImpl
) => {
  if (["GET", "POST"].indexOf(req?.method ?? "") == -1) {
    res.writeHead(405);
    const response = JSON.stringify({
      message: `${req.method} is not allowed for the request.`,
    });
    res.end(response);
    return true;
  }

  return false;
};
