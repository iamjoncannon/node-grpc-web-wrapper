import { RpcError, Status } from "grpc-web";
import { GreeterClient } from "./webtext/HelloworldServiceClientPb";
import { HelloRequest, RepeatHelloRequest } from "./webtext/helloworld_pb";
import XMLHttpRequest from "xhr2";
import { GRPC_TIMEOUT_HEADER } from "../../deadline";

global.XMLHttpRequest = XMLHttpRequest;

const client = new GreeterClient("http://localhost:1337", null, null);

export const testUnary = async () => {
  const request = new HelloRequest();
  request.setName("World");

  const stream = client.sayHello(
    request,
    null,
    (sayHelloErr, sayHelloResponse) => {
      console.log({ sayHelloErr });
      console.log(sayHelloResponse.getMessage());
    }
  );

  stream.on("data", (response) => {
    console.log("testUnary data", response.getMessage());
  });

  stream.on("status", (status: Status) => {
    console.log("testStream status: ", status);
  });

  stream.on("end", () => {
    console.log("testUnary end");
  });
};

export const testStream = () => {
  const streamRequest = new RepeatHelloRequest();

  streamRequest.setName("World");
  streamRequest.setCount(2);

  const md = { [GRPC_TIMEOUT_HEADER]: "1M" };

  const stream = client.sayRepeatHello(streamRequest, md);

  stream.on("data", (response) => {
    console.log("testStream data", response.getMessage());
  });

  stream.on("status", (status: Status) => {
    console.log("testStream status: ", status);
  });

  stream.on("end", () => {
    console.log("testStream end");
  });

  stream.on("error", (err: RpcError) => {
    console.log(
      `Unexpected stream error: code = ${err.code}` +
        `, message = "${err.message}"`
    );
  });

  return stream;
};

if (require.main === module) {
  if (process.env.TEST === "unary") {
    console.log("testing unary");
    testUnary();
  }

  if (process.env.TEST === "stream") {
    testStream();
  }
}
