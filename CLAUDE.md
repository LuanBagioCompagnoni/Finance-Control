# Finance Control

Plataforma web pessoal para controle financeiro.

## Estrutura

- `src/web/` — Next.js 15 + React 19 + Tailwind + shadcn/ui (@fc/web, porta 3000)
- `src/core/` — Express 5 + TypeScript + Mongoose (@fc/core, porta 5000)
- `docker-compose.yml` — MongoDB 7.0 + ambos os serviços

## Desenvolvimento

```bash
docker-compose up fc-mongo   # Só o banco
npm run dev:core             # Backend (porta 5000)
npm run dev:web              # Frontend (porta 3000)
```

## Stack

- Monorepo: npm workspaces
- Auth: JWT em cookie httpOnly (7 dias), bcrypt para senhas
- DB: MongoDB via Mongoose com schemas TypeScript
- Validação: Zod em todas as rotas do core

## Regras de Negócio

- Toda Transaction criada/deletada atualiza `account.balance` atomicamente
- EXPENSE/INVESTMENT: balance -= amount
- INCOME: balance += amount
- TRANSFER: debita `accountId`, credita `toAccountId`
- Criar InstallmentGroup → gera N Transactions automáticas (uma por mês)
- Registrar usuário → cria seed de categorias padrão automaticamente
