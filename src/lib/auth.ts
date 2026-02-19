import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

// WORKAROUND: Forçar URL correta sem quebra de linha
const FIXED_NEXTAUTH_URL = "https://chefexperience.vercel.app";
process.env.NEXTAUTH_URL = FIXED_NEXTAUTH_URL;

export const authOptions: NextAuthOptions = {
  // Adapter removido - usando JWT puro para OAuth
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
    updateAge: 0,              // ❗ Reprocessar JWT em toda request
  },
  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/completar-cadastro",
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
      console.log("========================================");
      console.log("🔑 SIGNIN CALLBACK INICIADO");
      console.log("========================================");
      console.log("Provider:", account?.provider);
      console.log("Email:", user?.email);
      console.log("User ID original:", user?.id);
      
      // Para OAuth, criar/atualizar usuário no banco manualmente
      if (account?.provider === "google" && user.email) {
        console.log("✅ É Google OAuth, processando...");
        
        try {
          // Verificar se usuário já existe
          console.log("🔍 Verificando se usuário existe...");
          const existingUsers = await prisma.$queryRaw`
            SELECT id, email FROM "User" WHERE email = ${user.email} LIMIT 1
          `;
          
          console.log("📊 Usuários encontrados:", existingUsers);
          
          let dbUser: any;
          
          if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            dbUser = existingUsers[0];
            console.log("✅ Usuário JÁ EXISTE:", dbUser.id);
          } else {
            console.log("🆕 Usuário NÃO existe, criando novo...");
            
            try {
              const newUsers = await prisma.$queryRaw`
                INSERT INTO "User" (id, email, name, password, "createdAt", "updatedAt")
                VALUES (gen_random_uuid(), ${user.email}, ${user.name || user.email.split('@')[0]}, '', NOW(), NOW())
                RETURNING id, email, name
              `;
              
              console.log("📦 Resultado INSERT:", newUsers);
              
              if (Array.isArray(newUsers) && newUsers.length > 0) {
                dbUser = newUsers[0];
                console.log("✅ NOVO USUÁRIO CRIADO:", dbUser);
              } else {
                console.error("❌ INSERT não retornou dados");
              }
            } catch (insertError: any) {
              console.error("❌ ERRO NO INSERT:", insertError.message);
              console.error("Stack:", insertError.stack);
            }
          }
          
          if (dbUser?.id) {
            console.log("📝 Atualizando user.id de", user.id, "para", dbUser.id);
            user.id = dbUser.id;
          } else {
            console.error("❌ dbUser inválido:", dbUser);
          }
          
        } catch (error: any) {
          console.error("❌ ERRO GERAL:", error.message);
          console.error("Stack:", error.stack);
        }
        
        console.log("========================================");
        console.log("🔑 SIGNIN CALLBACK FINALIZADO");
        console.log("========================================");
      } else {
        console.log("ℹ️ Não é Google OAuth ou sem email, pulando criação de usuário");
      }
      
      return true;
    },
    
    async redirect({ url, baseUrl }) {
      console.log("🔄 Redirect callback:", { url, baseUrl });
      
      try {
        // URLs relativas
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        
        // URLs absolutas do mesmo origin
        const target = new URL(url);
        if (target.origin === baseUrl) return url;
      } catch (error) {
        console.error("❌ Erro no redirect callback:", error, { url, baseUrl });
      }
      
      // Fallback seguro
      return baseUrl;
    },
    
    async jwt({ token, user, account, profile, trigger }) {
      console.log("🔐 JWT callback:", { 
        hasUser: !!user, 
        hasTokenId: !!token.id,
        userId: user?.id,
        trigger 
      });
      
      // Quando um usuário faz login (via OAuth ou credentials)
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = (user as any).image;
        console.log("✅ Token populado com user ID:", user.id);
      }
      
      // SEMPRE buscar o type atualizado do banco
      if (token.id) {
        try {
          const users = await prisma.$queryRaw`
            SELECT type FROM "User" WHERE id = ${token.id} LIMIT 1
          `;
          if (Array.isArray(users) && users.length > 0) {
            token.type = users[0].type;
            console.log("✅ Type do usuário carregado:", users[0].type);
          }
        } catch (e) {
          console.error('❌ Erro ao buscar tipo do usuário:', e);
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      console.log("👤 Session callback:", { 
        hasToken: !!token, 
        hasSessionUser: !!session.user,
        tokenType: token?.type 
      });
      
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
      console.log("📊 Event signIn:", { 
        email: user.email, 
        provider: account?.provider, 
        isNewUser,
        userId: user.id 
      });
      
      // Se é um novo usuário via OAuth, logar informação
      if (isNewUser && account?.provider !== "credentials") {
        console.log("🆕 Novo usuário OAuth criado:", user.email);
      }
    },
    async createUser({ user }) {
      console.log("👤 Usuário criado no banco:", { email: user.email, id: user.id });
    },
    async linkAccount({ user, account, profile }) {
      console.log("🔗 Conta vinculada:", { 
        userId: user.id, 
        provider: account.provider,
        providerAccountId: account.providerAccountId 
      });
    },
    async session({ session, token }) {
      console.log("📅 Session event:", { 
        hasSession: !!session, 
        hasUser: !!session?.user,
        userEmail: session?.user?.email 
      });
    },
  },
};
