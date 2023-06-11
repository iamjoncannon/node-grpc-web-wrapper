import { RpcError, Status } from "grpc-web";
import { GreeterClient } from "./HelloworldServiceClientPb";
import { HelloReply, HelloRequest, RepeatHelloRequest } from "./helloworld_pb";
import XMLHttpRequest from "xhr2";
global.XMLHttpRequest = XMLHttpRequest;

export const testUnary = async () => {
  const client = new GreeterClient("http://localhost:1337", null, null);
  const request = new HelloRequest();
  request.setName("World");
  const response = await client.sayHello(request, null);
  return response;
};

export const runHelloStream = () => {
  const client = new GreeterClient("http://localhost:1337", null, null);

  // server streaming call
  const streamRequest = new RepeatHelloRequest();
  streamRequest.setName("World");
  streamRequest.setCount(2);

  // stream: ClientReadableStream
  const stream = client.sayRepeatHello(streamRequest, {});

  stream.on("data", (response: HelloReply) => {
    console.log("data", response.getMessage());
  });

  stream.on("status", (status: Status) => {
    console.log("status: ", status);
  });

  stream.on("end", () => {
    console.log("end");
  });

  stream.on("error", (err: RpcError) => {
    console.log(
      `Unexpected stream error: code = ${err.code}` +
        `, message = "${err.message}"`
    );
  });
};

if (require.main === module) {
  if (process.env.MODE === "testUnary") {
    testUnary().then((res) => console.log(res.getMessage()));
  }
}
