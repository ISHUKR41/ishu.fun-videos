import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";

const internalAdminPath = "/control-room-9x72";
const publicAdminPath = `/${siteConfig.adminHidePath}`;

function normalizePath(pathname: string): string {
  return pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
}

export function middleware(request: NextRequest) {
  const pathname = normalizePath(request.nextUrl.pathname);

  const isAdminSurface = pathname === publicAdminPath || pathname === internalAdminPath;
  const applyAdminHeaders = (response: NextResponse) => {
    if (isAdminSurface) {
      response.headers.set("x-robots-tag", "noindex, nofollow, noarchive");
    }

    return response;
  };

  if (publicAdminPath !== internalAdminPath && pathname === publicAdminPath) {
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = internalAdminPath;
    return applyAdminHeaders(NextResponse.rewrite(rewritten));
  }

  if (publicAdminPath !== internalAdminPath && pathname === internalAdminPath) {
    const blocked = request.nextUrl.clone();
    blocked.pathname = "/404";
    return applyAdminHeaders(NextResponse.rewrite(blocked));
  }

  return applyAdminHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"]
};
