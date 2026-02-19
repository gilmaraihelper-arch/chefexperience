import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/completar-cadastro", // Redirecionar novos usuários
  },
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    // Login com email/senha (existente)
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
          image: (user as any).image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Permitir login social
      if (account?.provider === "google") {
        return true;
      }
      return true;
    },
    
    async jwt({ token, user, account, profile, trigger }) {
      // Quando um usuário faz login (via OAuth ou credentials)
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = (user as any).image;
      }
      
      // SEMPRE buscar o type atualizado do banco
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { type: true }
          });
          if (dbUser) {
            token.type = dbUser.type;
          }
        } catch (e) {
          console.error('Erro ao buscar tipo do usuário:', e);
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.type = token.type as string | null;
        session.user.image = token.image as string | null;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      // Se é um novo usuário via OAuth, criar perfil básico
      if (isNewUser && account?.provider !== "credentials") {
        console.log("Novo usuário OAuth:", user.email);
      }
    },
  },
};
