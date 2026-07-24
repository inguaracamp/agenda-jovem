import type { NextAuthConfig } from "next-auth";

export type AppRole = "LEADER" | "ADMIN";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: AppRole;
      churchId: string | null;
    };
  }

  interface User {
    role: AppRole;
    churchId: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: AppRole;
    churchId: string | null;
  }
}

/**
 * Config leve para Edge (middleware).
 * Sem Prisma/bcrypt — só JWT + callbacks.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;

      if (pathname.startsWith("/painel") || pathname.startsWith("/admin")) {
        if (!isLoggedIn) return false;
      }

      if (pathname.startsWith("/admin") && role !== "ADMIN") {
        return Response.redirect(new URL("/painel", request.nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.churchId = user.churchId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.churchId = token.churchId;
        session.user.name = token.name ?? "";
        session.user.email = token.email ?? "";
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
