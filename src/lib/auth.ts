import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

// WORKAROUND: Forçar URL correta
const FIXED_NEXTAUTH_URL = "https://chefexperience.vercel.app";
process.env.NEXTAUTH_URL = FIXED_NEXTAUTH_URL;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          type: user.type,
        };
      },
    }),
  ],
  callbacks: {
    // JWT callback - simpler version
    async jwt({ token, user, account }) {
      // Primeiro login - adicionar dados ao token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        
        // Se é OAuth, buscar type do banco
        if (account?.provider === 'google') {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });
          if (dbUser) {
            token.type = dbUser.type;
          }
        } else {
          token.type = (user as any).type;
        }
      }
      
      // Sempre buscar type atualizado do banco
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { type: true }
        });
        if (dbUser) {
          token.type = dbUser.type;
        }
      }
      
      return token;
    },
    
    // Session callback - expor dados
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).email = token.email;
        (session.user as any).name = token.name;
        (session.user as any).type = token.type;
      }
      return session;
    },
  },
};
