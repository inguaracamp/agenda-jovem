import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (pathname.startsWith("/painel") || pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const login = new URL("/login", req.nextUrl.origin);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/painel", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/painel/:path*", "/admin/:path*"],
};
