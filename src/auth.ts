import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/signin"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnPortal = nextUrl.pathname.startsWith("/portal");

      if (isOnPortal) {
        return isLoggedIn
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token.role && session.user) {
        session.user.role = token.role
      }
      return session
    }
  },
  providers: [
    Credentials({
      credentials: {
        role: { label: "Role", type: "text" },
        identifier: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials.identifier || !credentials.role) return null;
        try {
          let user;
          if (credentials.role === 'TEACHER' || credentials.role === 'ADMIN') {
            user = await prisma.user.findUnique({
              where: { email: credentials.identifier as string },
            })
            if (!user) return null;
            const isValidPassword = await bcrypt.compare(credentials.password as string, user.password as string);
            return isValidPassword ? user : null;
          } else {
            const firstName = (credentials.identifier as string).split(" ")[0];
            const lastName = (credentials.identifier as string).split(" ")[1];
            user = await prisma.user.findFirst({
              where: {
                firstName,
                lastName,
                role: Role.STUDENT
              },
            });
            if (!user) return null;
            return user
          }
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      }
    })
  ]
});