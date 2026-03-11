import { PrismaAdapter } from "@auth/prisma-adapter";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { db } from "@/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authConfig = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            password: true,
          },
        });
        if (!user?.password) return null;

        const isValid = await bcrypt.compare(
          parsed.data.password,
          user.password,
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth }) {
      return !!auth;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;