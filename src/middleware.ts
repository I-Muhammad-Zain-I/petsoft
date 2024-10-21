import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  externalUrls,
  publicRoutes,
} from "@/auth-routes";

import { auth } from "./auth";

export default auth((req) => {
  const { nextUrl } = req;
  // console.log("nextUrl", nextUrl.href);

  const isExternalUrl = externalUrls.some((url) =>
    nextUrl.href.startsWith(url)
  );

  // console.log("isExternal", isExternalUrl);
  if (isExternalUrl) {
    // console.log("External URL detected, skipping middleware redirection");
    return null;
  }

  const hasCompletedPayment = req.auth?.user.hasCompletedPayment;
  console.log(req.auth);
  const isLoggedIn = Boolean(req.auth);

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (!isLoggedIn) return null;
    if (!hasCompletedPayment) {
      return Response.redirect(new URL("/payment", nextUrl));
    }
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  console.log("isLoggedIn", isLoggedIn, "isPublicRoute", isPublicRoute);

  if (!isPublicRoute) {
    if (!isLoggedIn) {
      console.log("Redirecting to login");
      return Response.redirect(
        new URL(
          `/login?callbackUrl=${encodeURIComponent(req.nextUrl.href)}`,
          nextUrl
        )
      );
    }

    if (nextUrl.pathname !== "/payment" && !hasCompletedPayment) {
      console.log("Redirecting to payment");
      return Response.redirect(new URL("/payment", nextUrl));
    }

    if (nextUrl.pathname === "/payment" && hasCompletedPayment) {
      console.log("Redirecting to Dashboard");
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
  }

  // if (!isLoggedIn && !isPublicRoute) {
  //   console.log("Redirecting to login");

  //   return Response.redirect(
  //     new URL(
  //       `/login?callbackUrl=${encodeURIComponent(req.nextUrl.href)}`,
  //       nextUrl
  //     )
  //   );
  // }

  return null;
  // console.log(req.url);
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
