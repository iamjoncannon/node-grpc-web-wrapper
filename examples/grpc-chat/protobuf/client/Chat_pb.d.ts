import * as jspb from 'google-protobuf'



export class LoginRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LoginRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LoginRequest): LoginRequest.AsObject;
  static serializeBinaryToWriter(message: LoginRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LoginRequest;
  static deserializeBinaryFromReader(message: LoginRequest, reader: jspb.BinaryReader): LoginRequest;
}

export namespace LoginRequest {
  export type AsObject = {
  }
}

export class ChatPostFromClient extends jspb.Message {
  getContent(): string;
  setContent(value: string): ChatPostFromClient;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatPostFromClient.AsObject;
  static toObject(includeInstance: boolean, msg: ChatPostFromClient): ChatPostFromClient.AsObject;
  static serializeBinaryToWriter(message: ChatPostFromClient, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatPostFromClient;
  static deserializeBinaryFromReader(message: ChatPostFromClient, reader: jspb.BinaryReader): ChatPostFromClient;
}

export namespace ChatPostFromClient {
  export type AsObject = {
    content: string,
  }
}

export class ChatPost extends jspb.Message {
  getTime(): number;
  setTime(value: number): ChatPost;

  getChatid(): string;
  setChatid(value: string): ChatPost;

  getContent(): string;
  setContent(value: string): ChatPost;

  getHandle(): string;
  setHandle(value: string): ChatPost;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatPost.AsObject;
  static toObject(includeInstance: boolean, msg: ChatPost): ChatPost.AsObject;
  static serializeBinaryToWriter(message: ChatPost, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatPost;
  static deserializeBinaryFromReader(message: ChatPost, reader: jspb.BinaryReader): ChatPost;
}

export namespace ChatPost {
  export type AsObject = {
    time: number,
    chatid: string,
    content: string,
    handle: string,
  }
}

export class PostMessageRequest extends jspb.Message {
  getChatpostfromclient(): ChatPostFromClient | undefined;
  setChatpostfromclient(value?: ChatPostFromClient): PostMessageRequest;
  hasChatpostfromclient(): boolean;
  clearChatpostfromclient(): PostMessageRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PostMessageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PostMessageRequest): PostMessageRequest.AsObject;
  static serializeBinaryToWriter(message: PostMessageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PostMessageRequest;
  static deserializeBinaryFromReader(message: PostMessageRequest, reader: jspb.BinaryReader): PostMessageRequest;
}

export namespace PostMessageRequest {
  export type AsObject = {
    chatpostfromclient?: ChatPostFromClient.AsObject,
  }
}

export class PostMessageResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): PostMessageResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PostMessageResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PostMessageResponse): PostMessageResponse.AsObject;
  static serializeBinaryToWriter(message: PostMessageResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PostMessageResponse;
  static deserializeBinaryFromReader(message: PostMessageResponse, reader: jspb.BinaryReader): PostMessageResponse;
}

export namespace PostMessageResponse {
  export type AsObject = {
    success: boolean,
  }
}

export class GetMessagesRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMessagesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetMessagesRequest): GetMessagesRequest.AsObject;
  static serializeBinaryToWriter(message: GetMessagesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMessagesRequest;
  static deserializeBinaryFromReader(message: GetMessagesRequest, reader: jspb.BinaryReader): GetMessagesRequest;
}

export namespace GetMessagesRequest {
  export type AsObject = {
  }
}

export class GetMessagesResponse extends jspb.Message {
  getChatpostsList(): Array<ChatPost>;
  setChatpostsList(value: Array<ChatPost>): GetMessagesResponse;
  clearChatpostsList(): GetMessagesResponse;
  addChatposts(value?: ChatPost, index?: number): ChatPost;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMessagesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetMessagesResponse): GetMessagesResponse.AsObject;
  static serializeBinaryToWriter(message: GetMessagesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMessagesResponse;
  static deserializeBinaryFromReader(message: GetMessagesResponse, reader: jspb.BinaryReader): GetMessagesResponse;
}

export namespace GetMessagesResponse {
  export type AsObject = {
    chatpostsList: Array<ChatPost.AsObject>,
  }
}

