/* eslint-disable @typescript-eslint/no-unused-vars */

import { Role } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      role?: Role
    } & DefaultSession['user']
  }

  interface User {
    role?: Role
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role
  }
}