# grpc web client protos

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

compile script:

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
