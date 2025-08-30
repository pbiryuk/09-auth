import { NextRequest, NextResponse } from "next/server";
import { checkServerSession } from "@/lib/api/serverApi";
import { parse } from "cookie";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function middleware(req: NextRequest) {
  const cookieStore = await req.cookies;
  const { pathname } = req.nextUrl;

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!accessToken && refreshToken) {
    try {
      const sessionValid = await checkServerSession();

      if (sessionValid) {
        if (isPublicRoute) return NextResponse.redirect(new URL("/", req.url));
        if (isPrivateRoute) return NextResponse.next();
      }
    } catch (err) {
      console.error("Session check failed:", err);
      if (isPrivateRoute)
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  if (!accessToken) {
    if (isPrivateRoute)
      return NextResponse.redirect(new URL("/sign-in", req.url));
    if (isPublicRoute) return NextResponse.next();
  }

  if (accessToken && isPublicRoute)
    return NextResponse.redirect(new URL("/", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
