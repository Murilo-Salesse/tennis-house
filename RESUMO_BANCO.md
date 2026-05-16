# Resumo do Banco

## Tabelas

- `users`: admin com email, senha bcrypt, nome e role.
- `clients`: clientes das reservas.
- `bookings`: reservas com cliente, data, horario, status, valor e notas.
- `time_slots`: horarios disponiveis, preco e disponibilidade.
- `court_images`: imagens da quadra.

## Seed

O seed de producao cria ou atualiza:

- Admin: `admin@tennishouse.com`
- Horarios: `05:00` ate `23:00`

A senha do admin vem de `ADMIN_PASSWORD` e nao fica gravada no repositorio.

Para evitar dados falsos em producao, clientes, reservas e imagens de exemplo so sao criados se `SEED_SAMPLE_DATA="true"`.

## Comandos

```bash
npm run prisma:generate
npm run db:push
npm run db:seed
```

## Variaveis Necessarias

```env
DATABASE_URL=""
DIRECT_URL=""
NEXTAUTH_SECRET=""
NEXTAUTH_URL=""
ADMIN_EMAIL="admin@tennishouse.com"
ADMIN_PASSWORD=""
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
```
