import NextAuth from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      role?: Role;
    };
  }

  interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: Role;
  }
} 