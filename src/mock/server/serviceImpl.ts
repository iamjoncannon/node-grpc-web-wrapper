/* istanbul ignore file */

import {
  handleServerStreamingCall,
  handleUnaryCall,
  ServerUnaryCall,
  ServerWritableStream,
} from "@grpc/grpc-js";
import async from "async";
import * as grpc from "@grpc/grpc-js";
import _ from "lodash";
import { HelloRequest__Output } from "./proto/helloworld/HelloRequest";
import { HelloReply } from "./proto/helloworld/HelloReply";
import { RepeatHelloRequest__Output } from "./proto/helloworld/RepeatHelloRequest";

function copyMetadata(
  call: ServerUnaryCall<any, any> | ServerWritableStream<any, any>
) {
  const metadata = call.metadata.getMap();
  const response_metadata = new grpc.Metadata();
  for (const key in metadata) {
    response_metadata.set(key, metadata[key]);
  }
  return response_metadata;
}

export const doSayHello: handleUnaryCall<HelloRequest__Output, HelloReply> = (
  call,
  callback
) => {
  callback(null, { message: "Goodbye " + call.request.name });
};

export const doSayRepeatHello: handleServerStreamingCall<
  RepeatHelloRequest__Output,
  HelloReply
> = (call) => {
  const count = call.request.count ?? 0;
  const name = call.request.name ?? "";
  const senders = [];

  function sender(name: string) {
    return (callback: () => void) => {
      call.write({
        message: "Hey " + name,
      });
      _.delay(callback, 5);
    };
  }

  for (let i = 0; i < count; i++) {
    senders[i] = sender(name + i);
  }

  async.series(senders, () => {
    const metadata = copyMetadata(call);
    call.end(metadata);
  });
};
