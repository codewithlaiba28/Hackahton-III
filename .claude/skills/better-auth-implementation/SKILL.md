---
name: better-auth-implementation
description: Complete Better Auth implementation for LearnFlow platform
---

# Better Auth Implementation

## When to Use
- Implementing authentication in Next.js applications
- Building multi-role applications (student/teacher)
- Replacing custom JWT auth with Better Auth

## Instructions
1. Setup dependencies: `npm install better-auth drizzle-orm postgres`
2. Configure `.env.local`:
   ```bash
   BETTER_AUTH_SECRET=your-32-char-secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   DATABASE_URL=your-postgres-url
   ```
3. Run migrations: `psql -U user -d database -f ./infrastructure/postgres/migrations/004_better_auth_tables.sql`
4. Verify implementation: `python scripts/verify-auth.py`

## Validation
- [ ] Better Auth API healthy ( /api/auth/ok )
- [ ] Session endpoint reachable
- [ ] Registration and Login flows functional
- [ ] Database tables created (sessions, accounts, verifications)

See [REFERENCE.md](./REFERENCE.md) for detailed configuration, code examples, and troubleshooting.
