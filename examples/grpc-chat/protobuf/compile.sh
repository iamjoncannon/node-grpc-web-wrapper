
echo building protobufs

/usr/bin/protoc -I=. Chat.proto \
  --js_out=import_style=commonjs:./client \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:./client

echo done