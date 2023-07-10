# grpc web client protos

```protobuf
syntax = "proto3";

package helloworld;

service Greeter {
  rpc SayHello(HelloRequest) returns (HelloReply);
  rpc SayRepeatHello(RepeatHelloRequest) returns (stream HelloReply);
}

message HelloRequest {
  string name = 1;
}

message RepeatHelloRequest {
  string name = 1;
  int32 count = 2;
}

message HelloReply {
  string message = 1;
}
```

dockerfile to containerize the protoc build dependencies:

```dockerfile
FROM ubuntu

WORKDIR /compiler

RUN apt-get update && apt-get upgrade -y
RUN apt-get install protobuf-compiler golang-goprotobuf-dev npm -y
RUN npm install -g protoc-gen-grpc-web

COPY ./compile.sh .

ENTRYPOINT /compiler/compile.sh
```

for grpcwebtext, compile.sh:

```bash
/usr/bin/protoc -I=. helloworld.proto \
  --js_out=import_style=commonjs:. \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:.
```

build and run:

```sh

docker build \
  -f ./Dockerfile.protoc \
  -t protoc-compiler .

docker run -it \
-v $(PWD):/compiler protoc-compiler

```
