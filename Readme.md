# grpc-web node in-process translator

grpc-web currently uses http1 in the browser client due to the inability of xhr or fetch to support the same features as http2

grpc-web docs recommend using envoy proxy as a solution to support web clients with existing backend serivces, which creates an additional architectural requirement

this package provides standalone grpc-web service for node, similar to [grpc go wrapper](https://github.com/improbable-eng/grpc-web/tree/master/go) and the [tonic web wrapper](https://docs.rs/tonic-web/latest/tonic_web/). it also exposes a generic wrapper endpoint that can be incrementally added to any existing node service with a generic `http.IncomingMessage` (e.g. express, next.js, hapi etc) to provide further flexibility

## features currently supported

- unary services
- server streaming services
- metadata/trailers
- deadlines

## features not currently supported

- client streaming (not officially supported by gRPC-web)
- bidi streaming (not officially supported by gRPC-web)
- binary wire format (not officially supported by gRPC-web for server streaming)

## usage

### with existing node servers

see /examples for full working example of a simple chat app using React Hooks and Express

```ts
const chatServer: grpc.Server = createGrpcServer();

app.post("*", (req, res) => {
  // pass req res to callback with the grpc server
  grpcWebHandler(chatServer, req, res);
});
```

### standalone

```ts
import GrpcWebServer from "node-grpc-web-wrapper";
import * as grpc from "@grpc/grpc-js";

const server = new grpc.Server();

const myGrpcService: MyGrpcService = {
    ...handler definiitions
};

GrpcWebServer(myGrpcService, { cors: "*" }).listen(1337, () => {});
```

see src/mock/server and src/index.integration.test.ts for full working example

## testing

package has ~100% unit test coverage

```
npm test
```

one off tests for unary and server streaming

```
npm run start

npm run test:unary
npm run test:stream
```
