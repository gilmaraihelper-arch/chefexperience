import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

// WORKAROUND: Forçar URL correta sem quebra de linha
const FIXED_NEXTAUTH_URL = "https://chefexperience.vercel.app";
process.env.NEXTAUTH_URL = FIXED_NEXTAUTH_URL;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  logger: {
    error: (code, metadata) => {
      console.error("❌ NextAuth Error:", code, metadata);
    },
    warn: (code) => {
      console.warn("⚠️ NextAuth Warn:", code);
    },
    debug: (code, metadata) => {
      console.log("🔍 NextAuth Debug:", code, metadata);
    },
  },
  providers: [
    // Google OAuth - com allowDangerousEmailAccountLinking para vincular contas com mesmo email
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // Vincula automaticamente contas com mesmo email
    }),
    
    // Login com email/senha
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
    // 1. signIn callback - NÃO retorna URL, só true/false
    async signIn({ user, account, profile }) {
      console.log("🔑 signIn callback:", { 
        provider: account?.provider, 
        email: user?.email,
        isNewUser: user?.id 
      });
      
      // Para OAuth, garantir que usuário existe no banco
      if (account?.provider === "google" && user.email) {
        try {
          const userEmail = user.email.toLowerCase();
          
          // Verificar se usuário já existe
          let dbUser = await prisma.user.findUnique({
            where: { email: userEmail }
          });
          
          if (!dbUser) {
            // Criar novo usuário
            dbUser = await prisma.user.create({
              data: {
                email: userEmail,
                name: user.name || userEmail.split('@')[0],
                password: '', // OAuth users don't have password
              }
            });
            console.log("✅ Novo usuário criado via OAuth:", dbUser.id);
          } else {
            console.log("✅ Usuário existente encontrado:", dbUser.id, "type:", dbUser.type);
          }
          
        } catch (error: any) {
          console.error("❌ Erro no signIn:", error.message);
        }
      }
      
      return true; // Não retornar URL aqui!
    },
    
    // 2. redirect callback -控制 redirect após login
    async redirect({ url, baseUrl }) {
      console.log("🔄 Redirect callback:", { url, baseUrl });
      
      // Se é callback do OAuth, processar
      if (url.includes('/api/auth/callback/')) {
        return url;
      }
      
      // URLs relativas
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // URLs do mesmo domínio
      try {
        const target = new URL(url);
        if (target.origin === baseUrl) return url;
      } catch (e) {}
      
      return baseUrl;
    },
    
    // 3. jwt callback - persistir dados do usuário no token (PRIMEIRO login)
    async jwt({ token, user, account, profile, trigger }) {
      console.log("🔐 JWT callback:", { 
        hasUser: !!user, 
        hasAccount: !!account,
        hasTokenId: !!token.id,
        trigger 
      });
      
      // Primeiro login (account existe) - adicionar dados ao token
      if (account && user) {
        console.log("🔐 Primeiro login, populando token...");
        
        // Se é OAuth, buscar/atualizar usuário no banco
        if (account.provider === 'google' && user.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email.toLowerCase() }
          });
          
          if (dbUser) {
            token.id = dbUser.id;
            token.type = dbUser.type;
            token.email = dbUser.email;
            token.name = dbUser.name;
            console.log("✅ Token populado com dados do banco:", dbUser.type);
          } else {
            // Usuário não existe no banco, usar dados do OAuth
            token.id = user.id;
            token.email = user.email;
            token.name = user.name;
            console.log("⚠️ Usuário não encontrado no banco, usando dados OAuth");
          }
        } else {
          // Login com credentials
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.type = (user as any).type;
        }
      }
      
      // Sempre atualizar com dados do banco (para garantir type correto)
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { type: true, email: true, name: true }
          });
          
          if (dbUser) {
            token.type = dbUser.type;
            token.email = dbUser.email;
            token.name = dbUser.name;
          }
        } catch (e) {
          console.error("❌ Erro ao buscar type do usuário:", e);
        }
      }
      
      return token;
    },
    
    // 4. session callback - expor dados do token para o cliente
    async session({ session, token }) {
      console.log("👤 Session callback:", { 
        hasToken: !!token,
        tokenType: token?.type 
      });
      
      if (token) {
        // Copiar dados do token para a sessão
        (session.user as any).id = token.id;
        (session.user as any).email = token.email;
        (session.user as any).name = token.name;
        (session.user as any).type = token.type;
        
        // Also expose accessToken for API calls
        (session as any).accessToken = token.accessToken;
        
        console.log("✅ Session populada:", { 
          id: token.id, 
          type: token.type,
          email: token.email 
        });
      }
      
      return session;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log("📊 Event signIn:", { 
        email: user.email, 
        provider: account?.provider, 
        isNewUser 
      });
    },
  },
};
