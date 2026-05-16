# Setup de Producao

## Estado Atual

- Banco: PostgreSQL via Supabase usando Prisma.
- Auth: NextAuth com credenciais.
- Admin: criado/atualizado pelo seed com email `admin@tennishouse.com`.
- Storage: Supabase Storage para upload de imagens.

## Variaveis no Vercel

Cadastre em `Project Settings > Environment Variables`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"
NEXTAUTH_SECRET="generate-a-strong-32-byte-secret"
NEXTAUTH_URL="https://your-production-domain.com"
ADMIN_EMAIL="admin@tennishouse.com"
ADMIN_PASSWORD="use-a-strong-password"
SEED_SAMPLE_DATA="false"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-public-anon-key"
SUPABASE_SERVICE_ROLE_KEY="server-only-service-role-key"
```

## Banco de Producao

Com as variaveis locais apontando para o Supabase de producao:

```bash
npm install
npm run prisma:generate
npm run db:push
npm run db:seed
```

O seed nao grava senha padrao no repositorio. Ele exige `ADMIN_PASSWORD` com pelo menos 16 caracteres e salva a senha com bcrypt.

## Deploy na Vercel

1. Importe o repositorio na Vercel.
2. Configure as variaveis de ambiente acima.
3. Rode o deploy.
4. Depois do deploy, ajuste `NEXTAUTH_URL` para a URL final da Vercel ou dominio proprio.
5. Acesse `/admin` com o email `admin@tennishouse.com` e a senha forte definida em `ADMIN_PASSWORD`.

## Checklist

- [ ] `.env`, `.env.local` e arquivos reais de ambiente nao estao versionados.
- [ ] `NEXTAUTH_SECRET` foi gerado forte.
- [ ] `ADMIN_PASSWORD` nao aparece em Markdown ou codigo fonte.
- [ ] `npm run db:push` executado no banco de producao.
- [ ] `npm run db:seed` executado no banco de producao.
- [ ] Deploy da Vercel usando as variaveis de producao.
