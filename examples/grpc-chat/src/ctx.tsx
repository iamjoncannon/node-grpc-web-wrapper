import React, { createContext, useContext, useRef, useState } from "react";
import { ChatServiceClient } from "./protobuf/ChatServiceClientPb";
import { ChatPost } from "./protobuf/Chat_pb";

interface IAppContext {
  isLoggedIn: boolean;
  isConnected: boolean;
  posts: ChatPost[];
  text: string;
  handle: string;
  mostRecentHealthCheckTimestampRef: React.MutableRefObject<number | undefined>;
  reconnectionAttempter: number | undefined;

  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setPosts: React.Dispatch<React.SetStateAction<ChatPost[]>>;
  setText: React.Dispatch<React.SetStateAction<string>>;
  setHandle: React.Dispatch<React.SetStateAction<string>>;
  setReconnectionAttempter: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;

  chatServiceClient: ChatServiceClient;
}

const AppContext = createContext({} as IAppContext);

export const AppProvider = ({ children }: { children: JSX.Element }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [posts, setPosts] = useState<ChatPost[]>([]);
  const [text, setText] = useState<string>("");
  const [handle, setHandle] = useState<string>("");
  const [reconnectionAttempter, setReconnectionAttempter] = useState<number>();

  const mostRecentHealthCheckTimestampRef = useRef<number | undefined>();
  const chatServiceClient = new ChatServiceClient("http://localhost:3001");

  const ctx = {
    isLoggedIn,
    setIsLoggedIn,
    posts,
    setPosts,
    text,
    setText,
    handle,
    setHandle,
    chatServiceClient,
    isConnected,
    setIsConnected,
    mostRecentHealthCheckTimestampRef,
    reconnectionAttempter,
    setReconnectionAttempter,
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
};

export const useAppState = () => {
  const ctx = useContext(AppContext);
  return ctx;
};
