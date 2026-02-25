# 🍳 ChefExperience

Plataforma de conexão entre clientes e profissionais de culinária (chefs, buffets, bartender, etc.).

## 🌐 URL

- **Produção:** https://chefexperience.vercel.app
- **Repositório:** https://github.com/gilmaraihelper-arch/chefexperience
- **Local:** `/Users/gilmaraihelper/.openclaw/workspace/chefexperience`

## 🛠️ Stack

- **Frontend/Backend:** Next.js 14 (App Router)
- **Database:** PostgreSQL (Vercel) / SQLite (dev local)
- **ORM:** Prisma
- **Autenticação:** NextAuth.js + OAuth (Google)
- **Styling:** Tailwind CSS

## 📱 Funcionalidades

### Para Clientes
- Cadastro/Login (email + Google OAuth)
- Busca de profissionais por tipo de evento
- Criação de eventos (wizard 6 passos)
- Recebimento de propostas
- Dashboard com eventos, propostas, favoritos
- Avaliação de profissionais

### Para Profissionais
- Cadastro com perfil profissional
- Dashboard com oportunidades e ganhos
- Sistema de match (0-100%)
- Recebimento de alertas de novos eventos
- Gestão de propostas

### Páginas Principais
| Rota | Descrição |
|------|-----------|
| `/` | Home |
| `/login` | Login |
| `/cadastro/cliente` | Cadastro cliente |
| `/cadastro/profissional` | Cadastro profissional |
| `/dashboard/cliente` | Dashboard cliente |
| `/dashboard/profissional` | Dashboard profissional |
| `/criar-evento` | Wizard criar evento (6 passos) |
| `/planos` | Planos e preços |
| `/faq` | FAQ (13 perguntas) |
| `/contato` | Página de contato |

## 🔑 Credenciais de Teste

```
Email: chef@chef.com
Senha: chef123
```

## ⚠️ Status

- **Status:** ✅ 100% Concluído (2026-02-22)
- **Produção:** https://chefexperience.vercel.app
- **Último deploy:** 25/02/2026 (00:23) - Carrega propostas enviadas na inicialização
- **Últimos fixes (25/02):** Carrega propostas enviadas na inicialização da página; Corrige filtro de eventos ao enviar proposta e adiciona contador em 'enviados'; Filtra eventos já propostos e corrige contador dinâmico

## 📋 QA Report (2026-02-22)

### Bugs Corrigidos (22/02)
- ✅ Admin panel - promoção user para ADMIN via API
- ✅ Evento status - filtro corrigido para usar hiredProposalId após contratação
- ✅ Dashboard Profissional - corrigido erro .map() no campo includes
- ✅ Modal orçamento - corrigido campos de data, pessoas e pacotes
- ✅ API events - adicionado maxBudget
- ✅ Match calculation - lógica simplificada e corrigida

### Funcionalidades
- ✅ Sistema de autenticação (NextAuth + Google OAuth)
- ✅ Cadastro de clientes (3 passos)
- ✅ Criação de eventos (wizard 6 passos)
- ✅ Sistema de match (algoritmo 0-100%)
- ✅ Sistema de emails/notificações (8 templates)
- ✅ Avaliação mútua cliente ↔ profissional

## 📂 Estrutura

```
chefexperience/
├── src/
│   └── app/
│       ├── page.tsx              # Home
│       ├── login/                # Login
│       ├── cadastro/             # Cadastro (cliente/profissional)
│       ├── dashboard/           # Dashboards (cliente/profissional)
│       ├── criar-evento/        # Wizard criar evento
│       ├── planos/              # Planos e preços
│       ├── faq/                 # FAQ
│       ├── contato/             # Contato
│       └── api/                 # APIs REST
│           ├── auth/            # Autenticação
│           ├── professionals/   # Busca profissionais
│           └── upload/           # Upload de imagens
├── prisma/
│   └── schema.prisma            # Schema do banco
└── .env                         # Variáveis de ambiente
```

## 🚀 Deploy

```bash
# Desenvolvimento
npm run dev

# Deploy (Vercel -	atentar para limite de deploys)
git add . && git commit -m "update" && git push
```

## 📝 Tarefas Pendentes

- [ ] Corrigir limite de deploys Vercel
- [ ] Testar fluxo completo de pagamento
- [ ] Testar integração de chat
- [ ] Dashboard Admin - conexões reais (não simulado)

---

*Última atualização: 2026-02-25*
*QA Engineer: Carol*
