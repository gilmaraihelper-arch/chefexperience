# Painel Administrativo - ChefExperience

## Acesso

URL: `/admin`

## Primeiro Acesso

Para tornar seu usuário administrador:

1. Faça login normalmente
2. Acesse: `POST /api/admin/make-admin` (ou use curl/Postman)
3. Ou execute diretamente no banco:

```sql
UPDATE "User" SET type = 'ADMIN' WHERE email = 'seu-email@exemplo.com';
```

## Funcionalidades

### 1. Dashboard (Visão Geral)
- Estatísticas de usuários (total, clientes, profissionais)
- Estatísticas de eventos (total, hoje, este mês)
- Estatísticas de propostas (total, pendentes, aceitas, valor)
- Ações rápidas

### 2. Gerenciamento de Usuários
- Listar todos os usuários
- Buscar por nome/email
- Filtrar por tipo (Cliente/Profissional)
- Editar usuário
- Ativar/Desativar usuário
- Deletar usuário

### 3. Gerenciamento de Eventos
- Listar todos os eventos
- Filtrar por status
- Editar eventos
- Cancelar eventos

### 4. Gerenciamento de Propostas
- Listar todas as propostas
- Filtrar por status (Pendente, Aceita, Rejeitada)
- Ver detalhes
- Aprovar/Rejeitar propostas

## APIs Disponíveis

### Dashboard
```
GET /api/admin/dashboard
```
Retorna estatísticas gerais.

### Usuários
```
GET    /api/admin/users?page=1&limit=20&search=nome&type=CLIENT
PATCH  /api/admin/users (body: { id, name, email, type, isActive, ... })
DELETE /api/admin/users?id=user-id
```

### Tornar Admin
```
POST /api/admin/make-admin
```
Torna o usuário logado em administrador (apenas se não houver outro admin).

## Segurança

- Todas as rotas de admin verificam se o usuário é do tipo 'ADMIN'
- Não é possível deletar o próprio usuário
- Alterações são logadas no console

## Próximas Funcionalidades

- [ ] Gráficos de crescimento
- [ ] Exportação de relatórios (CSV/Excel)
- [ ] Envio de newsletter
- [ ] Configurações do sistema
- [ ] Logs de auditoria
- [ ] Gestão de assinaturas
- [ ] Relatórios financeiros
