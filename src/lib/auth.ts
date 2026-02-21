import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

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
    newUser: "/completar-cadastro/escolher-tipo",
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
    // Redirect after login based on user type
    async redirect({ url, baseUrl }) {
      // If there's a callback URL, use it
      if (url.includes('callbackUrl')) {
        return url;
      }
      // After OAuth login, go to oauth-callback to check user type
      if (url === baseUrl || url === '/' || url === '/login') {
        return `${baseUrl}/api/auth/oauth-callback`;
      }
      return url;
    },

    // JWT callback - CRITICAL: This is where we ensure user exists in DB
    async jwt({ token, user, account, trigger }) {
      // Primeiro login com OAuth (account existe, user existe)
      if (account?.provider === 'google' && user?.email) {
        console.log("🔐 Google OAuth - primeiro login, verificando/criando usuário no banco...");
        
        // Buscar ou criar usuário
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase() }
        });
        
        if (!dbUser) {
          console.log("🔐 Criando usuário Google no banco...");
          dbUser = await prisma.user.create({
            data: {
              email: user.email.toLowerCase(),
              name: user.name || user.email.split('@')[0],
              password: '', // OAuth users don't have password
            }
          });
          console.log("✅ Usuário criado:", dbUser.id);
        }
        
        // Atualizar token com dados do banco
        token.id = dbUser.id;
        token.email = dbUser.email;
        token.name = dbUser.name;
        token.type = dbUser.type;
        
        console.log("✅ Token populado com dados do banco:", dbUser.id, dbUser.type);
      }
      // Login com credentials
      else if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.type = (user as any).type;
      }
      
      // Sempre buscar type atualizado do banco (para cobrir casos de update de perfil)
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { type: true, email: true, name: true }
        });
        if (dbUser) {
          token.type = dbUser.type;
          token.email = dbUser.email;
          token.name = dbUser.name;
        }
      }
      
      return token;
    },
    
    // Session callback
    async session({ session, token }) {
      console.log("👤 Session callback - populando sessão com token:", token.id, token.type);
      
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
