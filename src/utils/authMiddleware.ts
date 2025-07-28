import ko from "@/constants/ko.json";
import { notify } from "@/hooks/notify";
import { connectSocket } from "@/socket";
import { refreshAndStoreToken } from "@/utils/auth";
import { clearTokens, getAccessToken } from "@/utils/storage";

import type {
  ErrorContext,
  Middleware,
  RequestContext,
  ResponseContext,
} from "@generated/runtime";

export const authMiddleware: Middleware = {
  // 요청 전에 토큰을 헤더에 추가
  pre: async (context: RequestContext) => {
    const token = getAccessToken();
    if (token) {
      const newHeaders = new Headers(context.init.headers);
      newHeaders.set("Authorization", `Bearer ${token}`);

      return {
        url: context.url,
        init: {
          ...context.init,
          headers: newHeaders,
        },
      };
    }
    return { url: context.url, init: context.init };
  },

  // 응답 후 처리 - 401 에러 시 토큰 재발급
  post: async (context: ResponseContext) => {
    // 401 에러 시 토큰 재발급 처리
    if (context.response.status === 401) {
      console.log("Token expired, refreshing...");

      try {
        // 토큰 재발급 요청
        const newAccessToken = await refreshAndStoreToken();

        if (!newAccessToken) {
          throw new Error("재발급된 accessToken이 없습니다.");
        }

        // 새 토큰으로 원래 요청 재시도
        const retryHeaders = new Headers(context.init.headers);
        retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);

        const retryInit = {
          ...context.init,
          headers: retryHeaders,
        };

        console.log("Retrying request with new token...");
        connectSocket();

        // 원래 요청을 새 토큰으로 재시도
        const retryResponse = await fetch(context.url, retryInit);
        return retryResponse;
      } catch (reissueError: any) {
        console.error("Token refresh failed:", reissueError);

        if (reissueError.response && reissueError.response.status === 404) {
          notify({ text: ko["login.expired"], icon: "🚫", type: "error" });
        } else {
          notify({ text: ko["common.error"], icon: "🚫", type: "error" });
        }

        clearTokens();
        window.location.replace("/riot");
        return context.response;
      }
    }

    return context.response;
  },

  // 네트워크 에러 등 기타 에러 처리
  onError: async (context: ErrorContext) => {
    console.error("Network or other error:", context.error);
    // 401은 post hook에서 처리하므로 여기서는 다른 에러만 처리
    return undefined;
  },
};
