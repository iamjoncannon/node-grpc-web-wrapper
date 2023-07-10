import GrpcWebServer from ".";
import { IncomingMessage, Server, ServerResponse } from "http";
import { getMockGrpcService } from "./mock/server/service";
import { GreeterClient as GreeterClientWebText } from "./mock/clients/webtext/HelloworldServiceClientPb";
import {
  HelloReply,
  HelloRequest,
  RepeatHelloRequest,
} from "./mock/clients/webtext/helloworld_pb";
import { Metadata, RpcError, Status } from "grpc-web";
import { CONTENT_TYPE_HEADER, WEB_TEXT_HEADER } from "./util";

describe("server integration test-- webtext successful", () => {
  jest.useFakeTimers({ timerLimit: 100 });

  const mockService = getMockGrpcService();
  let testServer: Server<typeof IncomingMessage, typeof ServerResponse>;

  const client = new GreeterClientWebText("http://localhost:1337", null, null);

  beforeEach(() => {
    testServer = GrpcWebServer(mockService, { cors: "*" }).listen(
      1337,
      () => {}
    );
  });

  afterEach(() => {
    testServer.close();
  });

  it("handles valid unary request", async () => {
    const request = new HelloRequest();
    request.setName("World");

    // if you pass a callback it returns ClientReadableStream
    const res = client.sayHello(request, null, (err: RpcError) => {});

    // grpc specific response code
    res.on("status", (status: Status) => {
      expect(status.code).toEqual(0);
      expect(status.details).toEqual("ok");
    });

    // http response metadata
    res.on("metadata", (metadata: Metadata) => {
      expect(metadata["grpc-accept-encoding"]).toEqual("identity");
    });

    // the response
    res.on("data", (helloReply: HelloReply) => {
      expect(helloReply.getMessage()).toEqual("Goodbye World");
    });
  });

  it("handles valid serverStream request", () => {
    const streamRequest = new RepeatHelloRequest();
    streamRequest.setName("World");
    streamRequest.setCount(1);

    const stream = client.sayRepeatHello(streamRequest, {});

    stream.on("data", (response) => {
      expect(response.getMessage()).toEqual("Hey World0");
    });

    stream.on("status", (status: Status) => {
      if (!status.details) {
        expect(status.metadata?.["test-metadata"]).toEqual("from sendMetadata");
      } else {
        expect(status.metadata?.[CONTENT_TYPE_HEADER]).toEqual(WEB_TEXT_HEADER);
      }
    });

    stream.on("end", () => {
      expect(true);
    });
  });
});

describe("server integration tests-- error handlers", () => {
  const mockService = getMockGrpcService();
  let testServer: Server<typeof IncomingMessage, typeof ServerResponse>;

  beforeEach(() => {
    testServer = GrpcWebServer(mockService, { cors: "*" }).listen(
      1337,
      () => {}
    );
  });

  afterEach(() => {
    testServer.close();
  });

  it("handles unimplemented services-- client", async () => {
    const request = new HelloRequest();
    const client = new GreeterClientWebText(
      "http://localhost:1337",
      null,
      null
    );

    const stream = (client as GreeterClientWebText).unimplementedSayHello(
      request,
      null,
      (err) => {
        expect(err.code).toEqual(12);
        expect(err.message).toEqual(
          "/helloworld.Greeter/UnimplementedSayHello not implemented"
        );

        stream.cancel();
      }
    );

    // interestingly, this won't throw an error
    stream.on("error", (err) => {
      expect(err).toEqual(null);
    });
  });

  it("returns error if called with PUT", async () => {
    const res = await fetch("http://localhost:1337", { method: "PUT" });
    const response = await res.json();
    expect(response.message).toEqual("PUT is not allowed for the request.");
  });

  it("returns error if called with DELETE", async () => {
    const res = await fetch("http://localhost:1337", { method: "DELETE" });
    const response = await res.json();
    expect(response.message).toEqual("DELETE is not allowed for the request.");
  });
});

describe("preflight", () => {
  const mockService = getMockGrpcService();
  let testServer: Server<typeof IncomingMessage, typeof ServerResponse>;

  beforeAll(() => {
    testServer = GrpcWebServer(mockService).listen(1337, () => {});
  });

  afterAll(() => {
    testServer.close();
  });

  it("handles preflight options call", async () => {
    const res = await fetch("http://localhost:1337", { method: "OPTIONS" });
    expect(res.status).toEqual(204);
  });
});
