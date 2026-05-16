import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        const method = req.method;

        if (path.startsWith("/admin")) {
          return true;
        }

        const sensitiveApis = [
          "/api/bookings",
          "/api/time-slots",
          "/api/court-images",
          "/api/upload-image",
          "/api/clients",
        ];

        if (
          sensitiveApis.some((apiPath) => path.startsWith(apiPath)) &&
          method !== "GET"
        ) {
          return !!token;
        }

        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/bookings/:path*",
    "/api/time-slots/:path*",
    "/api/court-images/:path*",
    "/api/upload-image/:path*",
    "/api/clients/:path*",
  ],
};
