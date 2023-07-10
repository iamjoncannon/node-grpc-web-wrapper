import { Metadata } from "@grpc/grpc-js";
import { deadlineToString } from "@grpc/grpc-js/build/src/deadline";
import { GrcpServerCallImpl } from "./types";

// see grpc-node/packages/grpc-js/src/deadline.ts
export const MAX_TIMEOUT_TIME = 2147483647;
export const GRPC_TIMEOUT_HEADER = "grpc-timeout";

const units = {
  m: 1,
  S: 1000,
  M: 60 * 1000,
  H: 60 * 60 * 1000,
} as { [key: string]: number };

export const getTimeoutinMs = (metadata: Metadata) => {
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

      const unitMultiplier = units[unit as string];

      if (!unitMultiplier) {
        // tell the client the deadline header was invalid
        // res.sendMetadata()
        throw new Error("invalid deadline header");
      }

      // convert header deadline to ms
      const headerTimeoutNumberinMs = headerTimeoutNumber * unitMultiplier;

      // return current date plus converted ms
      return headerTimeoutNumberinMs;
    }
  } catch (err) {
    console.error(err);
    return MAX_TIMEOUT_TIME;
  }
  return MAX_TIMEOUT_TIME;
};

/**
 *  convert header deadline to epoch number
 */
export const getDeadlineFromMetadata = (
  metadata: Metadata,
  // istanbul ignore next
  getTimeoutinMsCb = getTimeoutinMs
) => {
  try {
    return new Date().getTime() + getTimeoutinMsCb(metadata);
  } catch (err) {
    return new Date().getTime() + MAX_TIMEOUT_TIME;
  }
};
