// Original file: protobuf/Chat.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ChatPost as _chat_ChatPost, ChatPost__Output as _chat_ChatPost__Output } from '../chat/ChatPost';
import type { GetMessagesRequest as _chat_GetMessagesRequest, GetMessagesRequest__Output as _chat_GetMessagesRequest__Output } from '../chat/GetMessagesRequest';
import type { GetMessagesResponse as _chat_GetMessagesResponse, GetMessagesResponse__Output as _chat_GetMessagesResponse__Output } from '../chat/GetMessagesResponse';
import type { LoginRequest as _chat_LoginRequest, LoginRequest__Output as _chat_LoginRequest__Output } from '../chat/LoginRequest';
import type { PostMessageRequest as _chat_PostMessageRequest, PostMessageRequest__Output as _chat_PostMessageRequest__Output } from '../chat/PostMessageRequest';
import type { PostMessageResponse as _chat_PostMessageResponse, PostMessageResponse__Output as _chat_PostMessageResponse__Output } from '../chat/PostMessageResponse';

export interface ChatServiceClient extends grpc.Client {
  ChatFeed(argument: _chat_LoginRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_chat_ChatPost__Output>;
  ChatFeed(argument: _chat_LoginRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_chat_ChatPost__Output>;
  chatFeed(argument: _chat_LoginRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_chat_ChatPost__Output>;
  chatFeed(argument: _chat_LoginRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_chat_ChatPost__Output>;
  
  GetMessages(argument: _chat_GetMessagesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_chat_GetMessagesResponse__Output>): grpc.ClientUnaryCall;
  GetMessages(argument: _chat_GetMessagesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_chat_GetMessagesResponse__Output>): grpc.ClientUnaryCall;
  GetMessages(argument: _chat_GetMessagesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_chat_GetMessagesResponse__Output>): grpc.ClientUnaryCall;
  GetMessages(argument: _chat_GetMessagesRequest, callback: grpc.requestCallback<_chat_GetMessagesResponse__Output>): grpc.ClientUnaryCall;
  getMessages(argument: _chat_GetMessagesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_chat_GetMessagesResponse__Output>): grpc.ClientUnaryCall;
  getMessages(argument: _chat_GetMessagesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_chat_GetMessagesResponse__Output>): grpc.ClientUnaryCall;
  getMessages(argument: _chat_GetMessagesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_chat_GetMessagesResponse__Output>): grpc.ClientUnaryCall;
  getMessages(argument: _chat_GetMessagesRequest, callback: grpc.requestCallback<_chat_GetMessagesResponse__Output>): grpc.ClientUnaryCall;
  
  PostMessage(argument: _chat_PostMessageRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_chat_PostMessageResponse__Output>): grpc.ClientUnaryCall;
  PostMessage(argument: _chat_PostMessageRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_chat_PostMessageResponse__Output>): grpc.ClientUnaryCall;
  PostMessage(argument: _chat_PostMessageRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_chat_PostMessageResponse__Output>): grpc.ClientUnaryCall;
  PostMessage(argument: _chat_PostMessageRequest, callback: grpc.requestCallback<_chat_PostMessageResponse__Output>): grpc.ClientUnaryCall;
  postMessage(argument: _chat_PostMessageRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_chat_PostMessageResponse__Output>): grpc.ClientUnaryCall;
  postMessage(argument: _chat_PostMessageRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_chat_PostMessageResponse__Output>): grpc.ClientUnaryCall;
  postMessage(argument: _chat_PostMessageRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_chat_PostMessageResponse__Output>): grpc.ClientUnaryCall;
  postMessage(argument: _chat_PostMessageRequest, callback: grpc.requestCallback<_chat_PostMessageResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface ChatServiceHandlers extends grpc.UntypedServiceImplementation {
  ChatFeed: grpc.handleServerStreamingCall<_chat_LoginRequest__Output, _chat_ChatPost>;
  
  GetMessages: grpc.handleUnaryCall<_chat_GetMessagesRequest__Output, _chat_GetMessagesResponse>;
  
  PostMessage: grpc.handleUnaryCall<_chat_PostMessageRequest__Output, _chat_PostMessageResponse>;
  
}

export interface ChatServiceDefinition extends grpc.ServiceDefinition {
  ChatFeed: MethodDefinition<_chat_LoginRequest, _chat_ChatPost, _chat_LoginRequest__Output, _chat_ChatPost__Output>
  GetMessages: MethodDefinition<_chat_GetMessagesRequest, _chat_GetMessagesResponse, _chat_GetMessagesRequest__Output, _chat_GetMessagesResponse__Output>
  PostMessage: MethodDefinition<_chat_PostMessageRequest, _chat_PostMessageResponse, _chat_PostMessageRequest__Output, _chat_PostMessageResponse__Output>
}
