import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/auth", "/api/results", "/api/live-results"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 공개 경로 및 정적 리소스는 통과
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // API 요청은 Bearer 토큰으로 이미 보호되므로 통과
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 쿠키 확인
  const token = request.cookies.get("dashboard-auth")?.value;
  if (token === process.env.DASHBOARD_PASSWORD) {
    return NextResponse.next();
  }

  // 미인증 → 로그인 페이지로 리다이렉트
  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
