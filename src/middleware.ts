import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  const { pathname } = request.nextUrl;

  // 로그인하지 않은 상태
  if (false && (pathname.startsWith('/match') || pathname.startsWith('/matching') || pathname.startsWith('/mypage') || pathname.startsWith('/user'))) {
  // if (token && (pathname.startsWith('/match') || pathname.startsWith('/matching') || pathname.startsWith('/mypage') || pathname.startsWith('/user'))) {
    // 루트 경로로 리다이렉트
    return NextResponse.redirect(new URL('/', request.url));
  }

  if ((pathname==="/match/game-mode" || pathname==="/match/profile" || pathname==="/match/progress" || pathname==="/matching/complete") && !request.nextUrl.search) {
    return NextResponse.redirect(new URL('/match', request.url));
  }

  // 로그인 상태일 경우 요청을 그대로
  return NextResponse.next();
}

export const config = {
  matcher: ['/match/:path*', '/matching/:path*'],
};
