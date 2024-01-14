import { NextRequest, NextResponse } from "next/server";
import { publicRoutes, privateRoutes, adminRoutes } from "./app/router/routes";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const token = request.cookies.get("jwt_token");
  // const userRole = (request.cookies.get("user_role") ?? "") as string;

  // Redirect to login if user tries to access a admin page route without a ROLE_ADMIN
  // if (adminRoutes.includes(url.pathname) && userRole !== "ROLE_ADMIN") {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // Redirect to login if user tries to access a private route without JWT
  if (privateRoutes.includes(url.pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to the dashboard if the user with a JWT tries to access a public route
  if (publicRoutes.includes(url.pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // All other routes
  return NextResponse.next();
}
