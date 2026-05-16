# Tennis House

Next.js app with Prisma/PostgreSQL, NextAuth admin login, and Supabase Storage.

## Production Deploy

Recommended flow:

1. Create or confirm the Supabase project.
2. Configure the production environment variables in Vercel.
3. Run Prisma against the production database.
4. Run the seed to create/update the admin user and default time slots.
5. Deploy the Next.js app on Vercel.

## Environment Variables

Set these in Vercel for Production:

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

Notes:

- `DATABASE_URL` should use the pooled Supabase connection for runtime.
- `DIRECT_URL` should use the direct Supabase connection for Prisma commands.
- `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to the browser.
- Keep `.env`, `.env.local`, and all real env files out of Git.

## Database Setup

Run these locally after your env points to the production Supabase database:

```bash
npm install
npm run prisma:generate
npm run db:push
npm run db:seed
```

The seed creates or updates:

- Admin user: `admin@tennishouse.com`
- Default time slots: `05:00` through `23:00`

Sample clients, bookings, and images are only created when `SEED_SAMPLE_DATA="true"`.

## Local Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Useful Scripts

```bash
npm run build
npm run lint
npm run prisma:generate
npm run db:push
npm run db:seed
```
