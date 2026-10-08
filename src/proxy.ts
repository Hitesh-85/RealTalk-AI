// import { NextRequest, NextResponse } from "next/server";
// export { default } from "next-auth/middleware";
// import { getToken } from "next-auth/jwt";

// export async function proxy(request: NextRequest) {
//   const token = await getToken({ req: request });
//   const url = request.nextUrl;

//   if (
//     token &&
//     (url.pathname.startsWith("/sign-in") ||
//       url.pathname.startsWith("/sign-up") ||
//       url.pathname.startsWith("/verify") ||
//       url.pathname.startsWith("/"))
//   ) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.redirect(new URL("/home", request.url));
// }

// export const config = {
//   matcher: ["/sign-in", "sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
// };

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });

  const { pathname } = request.nextUrl;

  const isSignInPage = pathname.startsWith("/sign-in");
  const isDashboard = pathname.startsWith("/dashboard");

  // Logged-in user trying to access sign-in page
  if (token && isSignInPage) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  // Logged-out user trying to access dashboard
  if (!token && isDashboard) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in/:path*",
    "/sign-up/:path*",
    "/verify/:path*",
    "/dashboard/:path*",
  ],
};
