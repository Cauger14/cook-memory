import type { NextAuthConfig } from "next-auth";

/**
 * Config minimale pour le middleware (Edge Runtime).
 * Pas d'import Prisma ici — Edge ne le supporte pas.
 */
export const authEdgeConfig = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth }) {
      return !!auth;
    },
  },
} satisfies NextAuthConfig;