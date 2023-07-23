import { useMemo } from "react";
import {
  useConnectionHealthCheck,
  useEnterKeyListen,
  useHandleLogin,
  useReconnectAttempt,
  useSendPost,
} from "./hooks";
import { useAppState } from "./ctx";
import { getConnectionStatusDisplay, prettyDate } from "./util";

export default function App() {
  const { posts, text, setText, isLoggedIn, isConnected } = useAppState();

  const handleLogin = useHandleLogin();

  const sendPost = useSendPost();

  useEnterKeyListen(sendPost, handleLogin);
  useConnectionHealthCheck();
  useReconnectAttempt();

  const postsForDisplay = useMemo(() => {
    posts.sort((a, b) => a.getTime() - b.getTime());
    return posts?.reverse();
  }, [posts]);

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white">
      <div className="fixed top-0 right-0 mr-4 mt-4">
        {getConnectionStatusDisplay(isConnected)}
      </div>
      <section className="h-[5svh] pt-2">
        <h1>grpc-web chat</h1>
      </section>
      <section className="h-[95svh] w-[50vw] min-w-[500px]">
        <div className="h-[100%]">
          <div className="w-[100%] mb-2">
            <input
              className="bg-[black] border-white border-2 w-[40vw] mr-6"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
            <button
              className="border-white border-2 pr-2 pl-2"
              onClick={isLoggedIn ? sendPost : handleLogin}
            >
              {isLoggedIn ? "send" : "log in"}
            </button>
          </div>
          <div className="h-[90svh] overflow-scroll">
            {postsForDisplay && (
              <div className="w-[100%]">
                {postsForDisplay.map((post) => {
                  return (
                    <div className="flex flex-row" key={post.getChatid()}>
                      <div className="[flex:3]">{post.getHandle()}</div>
                      <div className="[flex:10] align-start">
                        {post.getContent()}
                      </div>
                      <div className="[flex:3]">
                        {String(prettyDate(post.getTime()))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
