# grpc-web node in-process traslator

grpc-web currently uses http1 in the browser client due to the inability of xhr or fetch to support the same features as http2

grpc-web currently recommends using envoy as a proxy service between the browser client and grpc services, with a few languages (go and rust) supporting an 'in process' translator that does the http protocol translation

this package provides standalone grpc-web service for node, as well as a generic wrapper endpoint that can be incrementally added to any existing node service with a generic `http.IncomingMessage` (e.g. express, next.js, hapi etc).

only webtext wire format is currently supported (see mock/clients/readme.md for compiling example)

## test

package has 100% unit test coverage

```
npm test
```

test support for binary and webtext, unary and server streaming

```
npm run test:webtext:unary
npm run test:webtext:stream
npm run test:binary:unary
npm run test:binary:stream
```
