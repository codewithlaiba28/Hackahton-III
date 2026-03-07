---
name: better-auth-implementation
description: Complete Better Auth implementation for LearnFlow platform
---

# Better Auth Implementation Skill

## When to Use
- Implementing authentication in Next.js applications
- Need session-based auth with database persistence
- Building multi-role applications (student/teacher)
- Replacing JWT-based custom auth with Better Auth

## Implementation Overview

This skill implements Better Auth for the LearnFlow platform with:
- Email/password authentication
- Session management with database persistence
- Role-based access control (student/teacher)
- Drizzle ORM adapter for PostgreSQL

## Files Created/Modified

### Backend (Frontend API Routes)

1. **`frontend/src/lib/auth.ts`** - Better Auth server configuration
   - Database adapter setup with Drizzle
   - Email/password authentication
   - Session configuration (7-day expiry)
   - Custom database hooks

2. **`frontend/src/lib/auth-client.ts`** - Better Auth client configuration
   - Type-safe client setup
   - Exports signIn, signUp, signOut, useSession
   - Session and User type exports

3. **`frontend/src/pages/api/auth/[...all].ts`** - API route handler
   - Catches all /api/auth/* routes
   - Delegates to Better Auth handler
   - bodyParser disabled for Better Auth

### Frontend Pages

4. **`frontend/src/pages/register.tsx`** - Registration page
   - Uses `authClient.signUp.email()`
   - Stores role in localStorage
   - Redirects based on role after signup

5. **`frontend/src/pages/login.tsx`** - Login page
   - Uses `authClient.signIn.email()`
   - Retrieves role from localStorage
   - Redirects based on role after signin

6. **`frontend/src/pages/student/dashboard.tsx`** - Student dashboard
   - Uses `useSession()` hook
   - Protected route (redirects to login if no session)
   - Loads student progress data

7. **`frontend/src/pages/teacher/dashboard.tsx`** - Teacher dashboard
   - Uses `useSession()` hook
   - Protected route with role check
   - Redirects students to student dashboard

### Database Migrations

8. **`infrastructure/postgres/migrations/004_better_auth_tables.sql`** - Better Auth schema
   - sessions table
   - accounts table (for OAuth)
   - verifications table
   - Updates to users table (email_verified, image)

## Configuration

### Environment Variables

**Frontend (.env.local):**
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/learnflow
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
```

### Dependencies

```bash
npm install better-auth drizzle-orm postgres
```

## Usage Examples

### Registration

```typescript
import { authClient } from '@/lib/auth-client';

const { data, error } = await authClient.signUp.email({
  email: 'student@example.com',
  password: 'securePassword123',
  name: 'Student Name',
});

if (error) {
  console.error('Registration failed:', error.message);
} else {
  // Store role separately (Better Auth doesn't have role field by default)
  localStorage.setItem('learnflow_user_role', 'student');
  // Redirect to dashboard
  router.push('/student/dashboard');
}
```

### Login

```typescript
import { authClient } from '@/lib/auth-client';

const { data, error } = await authClient.signIn.email({
  email: 'student@example.com',
  password: 'securePassword123',
});

if (error) {
  console.error('Login failed:', error.error?.message);
} else {
  // Get role from localStorage
  const role = localStorage.getItem('learnflow_user_role') || 'student';
  // Redirect based on role
  if (role === 'teacher') {
    router.push('/teacher/dashboard');
  } else {
    router.push('/student/dashboard');
  }
}
```

### Session Management

```typescript
import { useSession } from '@/lib/auth-client';

function ProtectedComponent() {
  const { data: session, isPending } = useSession();
  
  if (isPending) {
    return <div>Loading...</div>;
  }
  
  if (!session) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {session.user.name}!</div>;
}
```

### Sign Out

```typescript
import { authClient } from '@/lib/auth-client';

await authClient.signOut();
// Session is cleared, redirect to login
router.push('/login');
```

## Database Schema

### Sessions Table
```sql
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Accounts Table (OAuth)
```sql
CREATE TABLE accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    account_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    -- ... additional OAuth fields
);
```

### Verifications Table
```sql
CREATE TABLE verifications (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Role-Based Access Control

Better Auth doesn't include role management by default. This implementation uses localStorage:

**On Registration:**
```typescript
localStorage.setItem('learnflow_user_role', role);
```

**On Dashboard Load:**
```typescript
const storedRole = localStorage.getItem('learnflow_user_role') || 'student';
```

**Note:** For production, consider:
1. Adding role to the users table
2. Using Better Auth's `databaseHooks.user.create.after` to set role
3. Creating a custom session field for role

## Verification

### Test Registration
```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

Expected response:
```json
{
  "token": "...",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User",
    "emailVerified": false
  }
}
```

### Test Health Check
```bash
curl http://localhost:3000/api/auth/ok
```

Expected response:
```json
{"ok":true}
```

### Test Session
```bash
curl http://localhost:3000/api/auth/session \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"
```

## Troubleshooting

### Issue: "Cannot find module 'better-auth'"
**Solution:** Run `npm install better-auth drizzle-orm postgres`

### Issue: Database tables not found
**Solution:** Run migration: `psql -U user -d database -f 004_better_auth_tables.sql`

### Issue: Session not persisting
**Solution:** Check BETTER_AUTH_SECRET is set and database connection is working

### Issue: Redirect not working after login
**Solution:** Ensure localStorage is being set and read correctly for role

## Migration from JWT Auth

If migrating from the previous JWT-based auth:

1. **Keep existing users table** - Better Auth adapts to existing schema
2. **Run new migrations** - Creates sessions, accounts, verifications tables
3. **Update login/register pages** - Use authClient methods instead of fetch
4. **Update protected routes** - Use useSession() hook instead of manual token check
5. **Remove JWT middleware** - Better Auth handles session validation

## Production Considerations

1. **Set secure cookies:** `useSecureCookies: true` in auth config
2. **Add email verification:** Set `requireEmailVerification: true`
3. **Add OAuth providers:** Configure Google, GitHub, etc.
4. **Add rate limiting:** Use `rateLimit: { enabled: true }`
5. **Add 2FA:** Use Better Auth two-factor plugin
6. **Store role in database:** Add role field to users table

## References

- [Better Auth Documentation](https://www.better-auth.com)
- [Better Auth GitHub](https://github.com/better-auth/better-auth)
- [Drizzle Adapter](https://www.better-auth.com/docs/adapters/drizzle)
- [Skills.sh Better Auth Skills](https://skills.sh/better-auth/skills)
