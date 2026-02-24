# Troubleshooting - ChefExperience

Guia de correções para erros comuns que reaparecem periodicamente.

---

## 🐛 Erro: "Application error: a client-side exception"

**Quando acontece:**
- Após login com Google OAuth (Gmail)
- Ao acessar dashboard de profissional ou cliente
- Após alterações no código dos dashboards

**Causa raiz:**
Race condition no fluxo de autenticação OAuth:
1. Callback redireciona para `/dashboard?token=JWT`
2. Código salva token no localStorage
3. Código faz `router.replace()` **imediatamente**, removendo token da URL
4. Fetch para buscar dados do usuário ainda está rodando em background
5. Página recarrega sem dados do usuário → crash na renderização

**Sintomas:**
- Tela branca com mensagem de erro
- Erro no console: "cannot read property of undefined"
- Após refresh manual, funciona normalmente

**Solução (código):**

```typescript
// ❌ ERRADO - Redireciona antes de receber dados
useEffect(() => {
  const tokenFromUrl = urlParams.get('token');
  if (tokenFromUrl) {
    localStorage.setItem('token', tokenFromUrl);
    fetch('/api/auth/token', { headers: { Authorization: `Bearer ${tokenFromUrl}` }})
      .then(res => res.json())
      .then(data => {
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      });
    router.replace('/dashboard/profissional'); // ← PROBLEMA: redireciona antes do fetch completar
  }
}, [router]);

// ✅ CORRETO - Aguarda dados antes de redirecionar
useEffect(() => {
  const tokenFromUrl = urlParams.get('token');
  if (tokenFromUrl) {
    localStorage.setItem('token', tokenFromUrl);
    fetch('/api/auth/token', { headers: { Authorization: `Bearer ${tokenFromUrl}` }})
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          setUserData(data.user); // ← Atualiza state também
        }
        router.replace('/dashboard/profissional'); // ← Só redireciona DEPOIS
      })
      .catch(err => {
        console.error('Erro:', err);
        router.replace('/dashboard/profissional'); // ← Mesmo com erro, redireciona
      });
  }
}, [router]);
```

**Verificações de segurança adicionais:**

```typescript
// Proteger acesso a propriedades que podem ser undefined
const userName = (session?.user?.name || userData?.name || 'Chef');
const userInitials = userName?.split(' ')?.map((n: string) => n[0])?.join('')?.substring(0, 2)?.toUpperCase() || 'CH';

// Proteger arrays que podem ser null/undefined
{(evento?.cuisineStyles ? JSON.parse(evento.cuisineStyles || '[]') : []).map(...)}
```

**Arquivos que precisam da correção:**
- `src/app/dashboard/profissional/page.tsx`
- `src/app/dashboard/cliente/page.tsx`

**Commit de referência:** `df24792` (2026-02-24)

---

## 📝 Checklist antes de commitar alterações nos dashboards

- [ ] Verificar se o useEffect do OAuth ainda aguarda o fetch antes de redirecionar
- [ ] Adicionar `?.` (optional chaining) em todas as propriedades de objetos que vêm de API/localStorage
- [ ] Testar login com Google OAuth após alterações
- [ ] Testar login com email/senha após alterações

---

*Última atualização: 2026-02-24*
