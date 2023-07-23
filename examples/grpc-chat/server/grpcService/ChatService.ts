import * as grpc from "@grpc/grpc-js";
import { LoginRequest__Output } from "../protobuf/chat/LoginRequest";
import { ChatPost } from "../protobuf/chat/ChatPost";
import { ChatServiceHandlers } from "../protobuf/chat/ChatService";
import { PostMessageRequest } from "../protobuf/chat/PostMessageRequest";
import { PostMessageResponse } from "../protobuf/chat/PostMessageResponse";
import { GetMessageResponse } from "../protobuf/chat/GetMessageResponse";
import { GetMessageRequest } from "../protobuf/chat/GetMessageRequest";

export default class ChatService {
  currentChatClients: grpc.ServerWritableStream<
    LoginRequest__Output,
    ChatPost
  >[];
  chatPosts: ChatPost[];

  constructor() {
    this.currentChatClients = [];
    this.chatPosts = [];
  }

  getHandleId(md: grpc.Metadata) {
    return md.get("handle")?.[0];
  }

  broadcast(post: ChatPost) {
    this.currentChatClients.forEach((call) => {
      call.write(post);
    });
  }

  services() {
    const services: ChatServiceHandlers = {
      GetMessages: (
        _call: grpc.ServerUnaryCall<GetMessageRequest, GetMessageResponse>,
        callback: grpc.sendUnaryData<GetMessageResponse>
      ) => {
        callback(null, { chatPosts: this.chatPosts } as GetMessageResponse);
      },
      PostMessage: (
        call: grpc.ServerUnaryCall<PostMessageRequest, PostMessageResponse>,
        callback: grpc.sendUnaryData<PostMessageResponse>
      ) => {
        if (
          !call.request.chatPostFromClient ||
          !call.metadata.get("handle").length
        )
          return;

        const time = new Date().getTime();

        const chatPost = {
          time,
          chatId: String(Math.floor(Math.random() * 10 ** 10)),
          content: call.request.chatPostFromClient.content,
          handle: call.metadata.get("handle")[0],
        } as ChatPost;

        this.chatPosts.push(chatPost);
        this.broadcast(chatPost);

        callback(null, { success: true } as PostMessageResponse);
      },
      ChatFeed: (
        call: grpc.ServerWritableStream<LoginRequest__Output, ChatPost>
      ) => {
        this.currentChatClients.push(call);

        const handle = this.getHandleId(call.metadata);

        const loginMd = new grpc.Metadata();
        loginMd.set("login", handle);

        call.sendMetadata(loginMd);

        setInterval(() => {
          const md = new grpc.Metadata();
          const healthCheck = "healthCheck";
          md.set(healthCheck, String(new Date().getTime()));
          call.sendMetadata(md);
        }, 2000);
      },
    };

    return services;
  }
}
