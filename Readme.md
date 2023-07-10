# grpc-web node in-process traslator

grpc-web currently uses http1 in the browser client due to the inability of xhr or fetch to support the same features as http2

this package provides standalone grpc-web service for node, similar to grpc-go-wrapper and the gprc-web package for rust. additionally, it exposes a generic wrapper endpoint that can be incrementally added to any existing node service with a generic `http.IncomingMessage` (e.g. express, next.js, hapi etc) to provide flexibility and a substitute for envoy proxy

## features currently supported

- unary services
- server streaming services
- metadata/trailers
- deadlines

## features not currently supported

- client streaming (not officially supported by gRPC-web)
- bidi streaming (not officially supported by gRPC-web)
- binary wire format (not officially supported by gRPC-web for server streaming)

## testing

package has 100% unit test coverage

```
npm test
```

one off tests for unary and server streaming

```
npm run test:unary
npm run test:stream
```
