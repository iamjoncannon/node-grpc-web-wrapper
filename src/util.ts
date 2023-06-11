import { GrcpServerCallImpl } from "./types";
import * as http from "http";
import { Metadata } from "@grpc/grpc-js";
import { deadlineToString } from "@grpc/grpc-js/build/src/deadline";

const GRPC_TIMEOUT_HEADER = "grpc-timeout";

// see grpc-node/packages/grpc-js/src/deadline.ts
const MAX_TIMEOUT_TIME = 2147483647;

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
  res.setHeader("content-type", "application/grpc-web-text+proto");
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

const units = {
  m: 1,
  S: 1000,
  M: 60 * 1000,
  H: 60 * 60 * 1000,
} as { [key: string]: number };

/**
 *  convert header deadline to epoch number
 */
export const getDeadlineFromMetadata = (metadata: Metadata) => {
  const timeoutMapValue = metadata.get(GRPC_TIMEOUT_HEADER);

  try {
    // theres a deadline
    if (timeoutMapValue.length > 0) {
      // convert header format to date value
      const headerTimeout = timeoutMapValue[0];
      const unit = String(headerTimeout.at(-1));

      const headerTimeoutNumber = Number(
        headerTimeout.slice(0, headerTimeout.length - 1)
      );

      // convert header deadline to ms
      const headerTimeoutNumberinMs =
        headerTimeoutNumber * units[unit as string];

      // return current date plus converted ms
      return new Date().getTime() + headerTimeoutNumberinMs;
    }
  } catch (err) {
    return new Date().getTime() + MAX_TIMEOUT_TIME;
  }
  return new Date().getTime() + MAX_TIMEOUT_TIME;
};
