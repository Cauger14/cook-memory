import NextAuth from "next-auth";
import { authEdgeConfig } from "@/server/auth/config.edge";

const { auth } = NextAuth(authEdgeConfig);

export default auth;

export const config = {
  matcher: [
    "/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};