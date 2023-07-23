FROM ubuntu

WORKDIR /compiler

RUN apt-get update && apt-get upgrade -y
RUN apt-get install protobuf-compiler golang-goprotobuf-dev npm -y
RUN npm install -g protoc-gen-grpc-web protoc-gen-ts

COPY . . 

ENTRYPOINT /compiler/compile.sh