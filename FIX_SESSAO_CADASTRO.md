# Fix: Bug de Sessão Expirada no Cadastro Profissional

## Problema
A sessão expirava durante o preenchimento do formulário de cadastro profissional (v3), causando erro "Não autorizado - sessão inválida" ao clicar em "Finalizar".

## Causa Raiz
1. O token JWT gerado no OAuth callback expira em 7 dias, mas a sessão do NextAuth pode expirar antes
2. A API `complete-profile-professional` só verificava a sessão do NextAuth (`getServerSession`), ignorando o token JWT enviado no header Authorization
3. O cadastro profissional é um formulário longo (6 steps), aumentando a chance de expiração da sessão durante o preenchimento

## Solução Implementada

### 1. API `complete-profile-professional` (Backend)
- Adicionado suporte a autenticação via Bearer token JWT como fallback
- Agora tenta autenticar em ordem:
  1. Sessão NextAuth (session-token cookie)
  2. Bearer token no header Authorization (verificado com `jwt.verify()`)
- Melhorado o logging para debug de problemas de autenticação

### 2. API `complete-profile` (Backend) - Cliente
- Aplicada a mesma correção para garantir consistência entre os fluxos
- Também suporta ambos os métodos de autenticação

### 3. Frontend Cadastro Cliente
- Adicionado useEffect para capturar token da URL (quando vem do OAuth) e salvar no localStorage
- Atualizado o `handleSubmit` para enviar o token no header Authorization

### Arquivos Modificados
1. `/src/app/api/auth/complete-profile-professional/route.ts`
2. `/src/app/api/auth/complete-profile/route.ts`
3. `/src/app/cadastro/cliente/page.tsx`

## Testes
- Build realizada com sucesso
- Ambas as APIs agora aceitam sessão NextAuth ou token JWT
- Cadastro de cliente permanece funcionando (não foi quebrado)

## Deploy
Subir para produção e testar fluxo completo de cadastro profissional via OAuth.
