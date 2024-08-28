"use client";
import GlobalStyles from "@/styles/GlobalStyles";
import { ThemeProvider } from "styled-components";
import { theme } from "@/styles/theme";
import Header from "@/components/common/Header";
import StyledComponentsRegistry from "@/libs/registry";
import { Provider, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { AppStore, store } from "@/redux/store";
import { usePathname } from "next/navigation";
import { socket } from "@/socket";
import { friendOffline, friendOnline, memberId } from "@/redux/slices/chatSlice";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = store();
  }

  const pathname = usePathname();
  const isHeader = !(
    pathname === "/login" ||
    pathname.includes("/join") ||
    pathname.includes("/password")
  );


  /* 소켓 연결 */
  const SocketInitializer = () => {

    const dispatch = useDispatch();

    useEffect(() => {
      function onConnect() {
        console.log(`SOCKET ID: ${socket.id}`);
        const socketId = socket.id || "";
        localStorage.setItem("gamegooSocketId", socketId);
      }

      function onDisconnect() {
        console.log('소켓 끊김')
      }

      // 소켓이 이미 연결되어 있으면 리스너를 등록하기 전에 onConnect 호출
      if (socket.connected) {
        onConnect(); // 직접 호출
      }

      // connect 이벤트 리스너 등록
      socket.on("connect", onConnect);

      // disconnect 이벤트 리스너 등록
      socket.on("disconnect", onDisconnect);

      // member-info 이벤트 리스너 등록
      socket.on("member-info", async (res, cb) => {
        try {
          dispatch(memberId(res.data.memberId));
        } catch (error) {
          cb({ ok: false, error: error });
        }
      });

      // init-online-friend-list 이벤트 리스너 등록
      socket.on("init-online-friend-list", async (res, cb) => {
        try {
          const onlineFriendsList = res.data.onlineFriendMemberIdList;
          // onlineFriendsList 전체를 저장
          dispatch(friendOnline(onlineFriendsList));
        } catch (error) {
          cb({ ok: false, error: error });
        }
      });

      // friend-online 이벤트 리스너 등록
      socket.on("friend-online", async (res, cb) => {
        try {
          const onlineFriendId = res.data.memberId;
          // friendOnline 배열에 해당 id 없으면 추가
          dispatch(friendOnline(onlineFriendId));
        } catch (error) {
          cb({ ok: false, error: error });
        }
      });

      // friend-offline 이벤트 리스너 등록
      socket.on("friend-offline", async (res, cb) => {
        try {
          const onlineFriendId = res.data.memberId;
          // friendOnline 배열에 해당 id가 있으면 제거
          dispatch(friendOffline(onlineFriendId));
        } catch (error) {
          cb({ ok: false, error: error });
        }
      });

      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("member-info");
        socket.off("init-online-friend-list");
        socket.off("friend-online");
        socket.off("friend-offline");
      };
    }, [dispatch]);
    return null;
  }

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <StyledComponentsRegistry>
          <div id="modal-root"></div>
          <GlobalStyles />
          <ThemeProvider theme={theme}>
            <Provider store={storeRef.current}>
              <SocketInitializer />
              {isHeader && <Header />}
              {children}
            </Provider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

