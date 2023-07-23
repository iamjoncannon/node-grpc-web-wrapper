import { useCallback, useEffect } from "react";
import { useAppState } from "./ctx";
import { ChatServiceClient } from "./protobuf/ChatServiceClientPb";
import {
  ChatPost,
  ChatPostFromClient,
  GetMessagesRequest,
  LoginRequest,
  PostMessageRequest,
} from "./protobuf/Chat_pb";

export const connectToChatFeed = (
  chatServiceClient: ChatServiceClient,
  handle: string,
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>,
  mostRecentHealthCheckTimestampRef: React.MutableRefObject<number | undefined>,
  setPosts: React.Dispatch<React.SetStateAction<ChatPost[]>>
) => {
  const loginRequest = new LoginRequest();

  const chatStream = chatServiceClient.chatFeed(loginRequest, {
    handle,
  });

  chatStream.on("status", (status) => {
    setIsConnected(status.code === 0);

    if (status.metadata?.login) {
      setIsLoggedIn(true);
    }

    if (status.metadata?.healthcheck) {
      const healthTs = Number(status.metadata?.healthcheck);
      mostRecentHealthCheckTimestampRef.current = healthTs;
    }
  });

  chatStream.on("data", (post) => {
    setPosts((posts) => [...posts, post]);
  });

  chatStream.on("end", () => {
    console.log("chatStream end");
  });
};

export const useReconnectAttempt = () => {
  const {
    isLoggedIn,
    isConnected,
    handle,
    chatServiceClient,
    setIsLoggedIn,
    setIsConnected,
    mostRecentHealthCheckTimestampRef,
    setPosts,
    reconnectionAttempter,
    setReconnectionAttempter,
  } = useAppState();

  useEffect(() => {
    const shouldTryToReconnect = isLoggedIn && !isConnected;

    if (shouldTryToReconnect && !reconnectionAttempter) {
      const newReconnectionAttempter = setInterval(() => {
        connectToChatFeed(
          chatServiceClient,
          handle,
          setIsLoggedIn,
          setIsConnected,
          mostRecentHealthCheckTimestampRef,
          setPosts
        );
      }, 1000) as unknown as number;

      setReconnectionAttempter(newReconnectionAttempter);
    }

    if (!!reconnectionAttempter && !shouldTryToReconnect) {
      clearInterval(reconnectionAttempter);
      setReconnectionAttempter(undefined);
    }
  }, [
    chatServiceClient,
    handle,
    isConnected,
    isLoggedIn,
    mostRecentHealthCheckTimestampRef,
    reconnectionAttempter,
    setIsConnected,
    setIsLoggedIn,
    setPosts,
    setReconnectionAttempter,
  ]);
};

export const useHandleLogin = () => {
  const {
    mostRecentHealthCheckTimestampRef,
    setIsLoggedIn,
    setPosts,
    text,
    setText,
    setHandle,
    setIsConnected,
    chatServiceClient,
  } = useAppState();

  return useCallback(() => {
    if (text === "") return;
    setHandle(text);
    setText("");

    connectToChatFeed(
      chatServiceClient,
      text,
      setIsLoggedIn,
      setIsConnected,
      mostRecentHealthCheckTimestampRef,
      setPosts
    );

    const getMessagesRequest = new GetMessagesRequest();

    chatServiceClient
      .getMessages(getMessagesRequest, null)
      .then((getMessageResponse) => {
        const chatpostsList = getMessageResponse.getChatpostsList();
        setPosts(chatpostsList);
      });
  }, [
    chatServiceClient,
    mostRecentHealthCheckTimestampRef,
    setHandle,
    setIsConnected,
    setIsLoggedIn,
    setPosts,
    setText,
    text,
  ]);
};

export const useSendPost = () => {
  const { text, setText, handle, chatServiceClient } = useAppState();

  return useCallback(() => {
    if (text === "") return;
    setText("");

    const postMessageRequest = new PostMessageRequest();

    const chatPost = new ChatPostFromClient();
    chatPost.setContent(text);

    postMessageRequest.setChatpostfromclient(chatPost);

    chatServiceClient.postMessage(postMessageRequest, { handle });
  }, [chatServiceClient, handle, setText, text]);
};

export const useEnterKeyListen = (
  sendPost: () => void,
  handleLogin: () => void
) => {
  const { isLoggedIn } = useAppState();

  useEffect(() => {
    const listener = (e: any) => {
      if (e.key !== "Enter") return;
      isLoggedIn ? sendPost() : handleLogin();
    };

    window.addEventListener("keyup", listener);

    return () => window.removeEventListener("keyup", listener);
  }, [handleLogin, isLoggedIn, sendPost]);
};

export const useConnectionHealthCheck = () => {
  const { mostRecentHealthCheckTimestampRef, setIsConnected } = useAppState();

  useEffect(() => {
    setInterval(() => {
      if (!mostRecentHealthCheckTimestampRef.current) {
        return;
      }

      const timeToLastTs =
        new Date().getTime() - mostRecentHealthCheckTimestampRef.current;

      const hasRecentHealthcheck =
        mostRecentHealthCheckTimestampRef.current && timeToLastTs < 2000;

      setIsConnected(!!hasRecentHealthcheck);
    }, 2000);
  }, [mostRecentHealthCheckTimestampRef, setIsConnected]);
};
