import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { hostname, pathname } = request.nextUrl;
  
  // gamegoo.co.kr을 www.gamegoo.co.kr로 리다이렉트
  if (hostname === 'gamegoo.co.kr') {
    return NextResponse.redirect(
      new URL(`https://www.gamegoo.co.kr${pathname}${request.nextUrl.search}`)
    );
  }

  const token = request.headers.get("Authorization")?.split(" ")[1];

  // /member/profile 경로를 /user로 리다이렉트
  if (pathname.startsWith("/member/profile/")) {
    const userId = pathname.replace("/member/profile/", "");
    return NextResponse.redirect(new URL(`/user/${userId}`, request.url));
  }

  // 로그인하지 않은 상태
  if (
    token &&
    (pathname.startsWith("/match/game-mode") ||
      pathname.startsWith("/matching") ||
      pathname.startsWith("/mypage"))
  ) {
    // 루트 경로로 리다이렉트
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    (pathname === "/match/game-mode" ||
      pathname === "/match/profile" ||
      pathname === "/match/progress" ||
      pathname === "/matching/complete") &&
    !request.nextUrl.search
  ) {
    return NextResponse.redirect(new URL("/match", request.url));
  }

  // 로그인 상태일 경우 요청을 그대로
  return NextResponse.next();
}

export const config = {
  matcher: ["/match/:path*", "/matching/:path*", "/member/:path*", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
