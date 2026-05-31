import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail, getUserById } from "@/lib/user";
import bcryptjs from "bcryptjs";
import { LoginSchema } from "@/auth.config";
import { UserRole } from "@prisma/client";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id as string);

      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (session.user) {
        session.user.hasRole = token.hasRole as boolean;
        session.user.hasPassword = token.hasPassword as boolean;
      }
      return session;
    },
    async jwt({ token, user, trigger }) {
      // Only hit the DB when the token is first created (sign-in)
      // or explicitly refreshed. Never on every request.
      if (user) {
        // First sign-in: seed all fields from the user object
        const typedUser = user as { role?: string; password?: string };
        token.role = typedUser.role;
        token.hasRole = !!typedUser.role;
        token.hasPassword = !!typedUser.password;
        return token;
      }

      // On subsequent requests: read role/hasPassword from the token itself.
      // Only do a DB refresh if explicitly triggered (e.g. update() call).
      if (trigger === "update" && token.sub) {
        const existingUser = await getUserById(token.sub);
        if (existingUser) {
          token.role = existingUser.role;
          token.hasRole = !!existingUser.role;
          token.hasPassword = !!existingUser.password;
        }
      }

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days default
  },
  providers: [
    ...authConfig.providers,
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcryptjs.compare(password, user.password);

          // Return full user object so JWT callback can seed role & hasPassword
          // from this object without needing another DB round-trip
          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
});
