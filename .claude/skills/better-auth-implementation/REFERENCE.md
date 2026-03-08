# Better Auth Implementation Reference

This document contains detailed information about the Better Auth implementation in the LearnFlow platform.

## Architecture

LearnFlow uses Better Auth with a PostgreSQL database (via Drizzle adapter) to manage user sessions and authentication.

### Key Components

- **Auth Server (`frontend/src/lib/auth.ts`)**: Configures the Better Auth server logic, including the database adapter and email/password strategy.
- **Auth Client (`frontend/src/lib/auth-client.ts`)**: Provides a type-safe client for frontend pages to interact with.
- **API Router (`frontend/src/pages/api/auth/[...all].ts`)**: The entry point for all authentication requests.

## Database Schema

### Users Table (Extended)
The standard users table is extended with fields required by Better Auth:
- `emailVerified`: BOOLEAN
- `image`: TEXT (profile picture URL)

### Sessions
Manages active user sessions.
- `id`, `user_id`, `token`, `expires_at`, `created_at`, `updated_at`

### Accounts
Used for linking multiple authentication providers (e.g., Google, GitHub).
- `id`, `user_id`, `account_id`, `provider_id`, `access_token`, etc.

### Verifications
Used for email verification and password reset tokens.
- `id`, `identifier`, `value`, `expires_at`

## Implementation Details

### Role Management
Roles (Student/Teacher) are currently managed via `localStorage` during the registration process. For production, these should be moved to the database.

### Registration Flow
1. User enters details on `/register`.
2. `authClient.signUp.email()` is called.
3. Upon success, the user role is saved to `localStorage`.
4. User is redirected to their respective dashboard.

### Login Flow
1. User enters credentials on `/login`.
2. `authClient.signIn.email()` is called.
3. System retrieves the role (currently from `localStorage`).
4. User is redirected based on the role.

## Troubleshooting

- **Session Expiry**: Sessions are configured to expire after 7 days.
- **CORS Issues**: Ensure the `NEXT_PUBLIC_APP_URL` is set correctly in `.env.local`.
- **Database Connection**: Verify your `DATABASE_URL` is correct and the PostgreSQL server is reachable.
