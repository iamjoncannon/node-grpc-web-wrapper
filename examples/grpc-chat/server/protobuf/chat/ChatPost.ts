// Original file: protobuf/Chat.proto

import type { Long } from '@grpc/proto-loader';

export interface ChatPost {
  'time'?: (number | string | Long);
  'chatId'?: (string);
  'content'?: (string);
  'handle'?: (string);
}

export interface ChatPost__Output {
  'time'?: (Long);
  'chatId'?: (string);
  'content'?: (string);
  'handle'?: (string);
}
