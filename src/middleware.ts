import { NextResponse } from "next/server";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/auth-routes";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextApiRequest } from "next";

const { auth } = NextAuth(authConfig);
type CombineRequest = Request & NextApiRequest;

export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = Boolean(req.auth);

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  console.log("isLoggedIn", isLoggedIn, "isPublicRoute", isPublicRoute);
  if (!isLoggedIn) {
    console.log("Redirecting to login");
    return Response.redirect(new URL("/login", nextUrl));
  }

  return null;
  // console.log(req.url);
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
