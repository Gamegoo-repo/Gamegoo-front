import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAccessToken } from '@/utils/storage';

export function middleware(request: NextRequest) {
  const token = getAccessToken();
  const { pathname } = request.nextUrl;

  // 로그인하지 않은 상태
  if (!token && (pathname.startsWith('/match') || pathname.startsWith('/matching')) || pathname.startsWith('/mypage') || pathname.startsWith('/user')) {
    // 루트 경로로 리다이렉트
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 로그인 상태일 경우 요청을 그대로
  return NextResponse.next();
}

export const config = {
  matcher: ['/match/:path*', '/matching/:path*'],
};
