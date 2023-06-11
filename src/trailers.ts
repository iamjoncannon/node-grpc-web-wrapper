import * as grpc from "@grpc/grpc-js";
import { serializeTrailers } from "./serialize";
import { GrcpServerCallImpl } from "./types";

export const getSerializedOkTrailers = (metadata: grpc.Metadata) => {
  const formattedTrailersToSend = getFormattedMetadataForSerialization(
    metadata,
    okStatus()
  );

  return serializeTrailers(formattedTrailersToSend);
};

export const formatTrailersForSerialization = (trailersToSend: {
  [key: string]: string;
}) => {
  return Object.entries(trailersToSend)
    .map(([k, v]) => {
      return `${k}:${v}`;
    })
    .join("\r\n");
};

export const okStatus = () => {
  const statusBuilder = new grpc.StatusBuilder();
  return statusBuilder.withCode(0).withDetails("ok").build();
};

export const respondWithStatus = (
  res: GrcpServerCallImpl,
  code: grpc.status,
  message: string
) => {
  const statusBuilder = new grpc.StatusBuilder();
  const errorStatus = statusBuilder.withCode(code).withDetails(message).build();

  const trailers = serializeTrailers(
    formatTrailersForSerialization(
      processStatusObjectForSerialization(errorStatus)
    )
  );

  res.end(trailers);
};

export const processMetadataForSerialization = (metadata: grpc.Metadata) => {
  return Object.entries(metadata.getMap()).reduce((a, c) => {
    // grpc.MetadataValue = string | buffer
    a[c[0]] = c[1] as string; // to support binary, will need to convert this grpc.MetadataValue to string
    return a;
  }, {} as { [key: string]: string });
};

export const processStatusObjectForSerialization = (
  statusObject: Partial<grpc.StatusObject>
) => {
  return {
    "grpc-status": statusObject.code?.toString() ?? "0",
    "grpc-message": encodeURI(statusObject.details ?? ""),
  };
};

export const getFormattedMetadataForSerialization = (
  metadata: grpc.Metadata,
  status: Partial<grpc.StatusObject>
) => {
  const metadataMap = processMetadataForSerialization(metadata);
  const statusObj = processStatusObjectForSerialization(status);

  // see grpc-web GrpcWebClientReadableStream.parseHttp1Headers_
  const trailersToSend = {
    ...statusObj,
    ...metadataMap,
  };

  const formattedTrailersToSend =
    formatTrailersForSerialization(trailersToSend);

  return formattedTrailersToSend;
};

export const getSerializedMetadata = (metadata: grpc.Metadata) => {
  return serializeTrailers(
    formatTrailersForSerialization(processMetadataForSerialization(metadata))
  );
};
