// Original file: helloworld.proto

import type * as grpc from "@grpc/grpc-js";
import type { MethodDefinition } from "@grpc/proto-loader";
import type {
  HelloReply as _helloworld_HelloReply,
  HelloReply__Output as _helloworld_HelloReply__Output,
} from "./HelloReply";
import type {
  HelloRequest as _helloworld_HelloRequest,
  HelloRequest__Output as _helloworld_HelloRequest__Output,
} from "./HelloRequest";
import type {
  RepeatHelloRequest as _helloworld_RepeatHelloRequest,
  RepeatHelloRequest__Output as _helloworld_RepeatHelloRequest__Output,
} from "./RepeatHelloRequest";

export interface GreeterClient extends grpc.Client {
  SayHello(
    argument: _helloworld_HelloRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_helloworld_HelloReply__Output>
  ): grpc.ClientUnaryCall;
  SayHello(
    argument: _helloworld_HelloRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_helloworld_HelloReply__Output>
  ): grpc.ClientUnaryCall;
  SayHello(
    argument: _helloworld_HelloRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_helloworld_HelloReply__Output>
  ): grpc.ClientUnaryCall;
  SayHello(
    argument: _helloworld_HelloRequest,
    callback: grpc.requestCallback<_helloworld_HelloReply__Output>
  ): grpc.ClientUnaryCall;
  sayHello(
    argument: _helloworld_HelloRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_helloworld_HelloReply__Output>
  ): grpc.ClientUnaryCall;
  sayHello(
    argument: _helloworld_HelloRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_helloworld_HelloReply__Output>
  ): grpc.ClientUnaryCall;
  sayHello(
    argument: _helloworld_HelloRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_helloworld_HelloReply__Output>
  ): grpc.ClientUnaryCall;
  sayHello(
    argument: _helloworld_HelloRequest,
    callback: grpc.requestCallback<_helloworld_HelloReply__Output>
  ): grpc.ClientUnaryCall;

  SayRepeatHello(
    argument: _helloworld_RepeatHelloRequest,
    metadata: grpc.Metadata,
    options?: grpc.CallOptions
  ): grpc.ClientReadableStream<_helloworld_HelloReply__Output>;
  SayRepeatHello(
    argument: _helloworld_RepeatHelloRequest,
    options?: grpc.CallOptions
  ): grpc.ClientReadableStream<_helloworld_HelloReply__Output>;
  sayRepeatHello(
    argument: _helloworld_RepeatHelloRequest,
    metadata: grpc.Metadata,
    options?: grpc.CallOptions
  ): grpc.ClientReadableStream<_helloworld_HelloReply__Output>;
  sayRepeatHello(
    argument: _helloworld_RepeatHelloRequest,
    options?: grpc.CallOptions
  ): grpc.ClientReadableStream<_helloworld_HelloReply__Output>;
}

export interface GreeterHandlers extends grpc.UntypedServiceImplementation {
  SayHello: grpc.handleUnaryCall<
    _helloworld_HelloRequest__Output,
    _helloworld_HelloReply
  >;

  SayRepeatHello: grpc.handleServerStreamingCall<
    _helloworld_RepeatHelloRequest__Output,
    _helloworld_HelloReply
  >;
}

export interface GreeterDefinition extends grpc.ServiceDefinition {
  SayHello: MethodDefinition<
    _helloworld_HelloRequest,
    _helloworld_HelloReply,
    _helloworld_HelloRequest__Output,
    _helloworld_HelloReply__Output
  >;
  SayRepeatHello: MethodDefinition<
    _helloworld_RepeatHelloRequest,
    _helloworld_HelloReply,
    _helloworld_RepeatHelloRequest__Output,
    _helloworld_HelloReply__Output
  >;
}
