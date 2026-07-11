# HireFlow Backend — Authentication Module

Implements the full auth architecture: email/password signup with verification, login,
Google OAuth, JWT access + refresh tokens (HttpOnly cookie), protected routes,
forgot/reset password, and role-based access (student/admin).

## Setup

```bash
npm install
cp .env.example .env   # fill in your real values
npm run dev             # nodemon, or `npm start` for plain node
```

Requires a running MongoDB instance (local or Atlas) and a Google OAuth Client
(Google Cloud Console → APIs & Services → Credentials) with the callback URL
set to match `GOOGLE_CALLBACK_URL`.

For email sending, EMAIL_USER/EMAIL_PASS expects an app password if using Gmail
(regular password won't work with 2FA enabled). Swap nodemailer's transport for
SendGrid/SES/Mailgun in production.

## Endpoints

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/register | Public | Register + sends verification email |
| POST | /api/auth/login | Public | Login, returns access token + sets refresh cookie |
| POST | /api/auth/refresh-token | Cookie | Issue new access token |
| POST | /api/auth/logout | Bearer token | Clears refresh token + cookie |
| GET | /api/auth/verify-email/:token | Public | Verify email from link |
| POST | /api/auth/forgot-password | Public | Sends reset link |
| POST | /api/auth/reset-password/:token | Public | Sets new password |
| GET | /api/auth/me | Bearer token | Current user |
| GET | /api/auth/google | Public | Starts Google OAuth |
| GET | /api/auth/google/callback | Public | OAuth callback, redirects to frontend with token |
| GET | /api/auth/admin-only | Bearer token + admin role | Example RBAC route |

## How the pieces fit together

- **Access token**: short-lived (15m), sent in `Authorization: Bearer <token>` header,
  verified by `protect` middleware on every protected route.
- **Refresh token**: long-lived (7d), stored in an HttpOnly/Secure cookie (JS can't
  read it — XSS protection) and mirrored in the user's DB record so it can be
  invalidated on logout or password reset.
- **Role-based access**: `authorize("admin")` middleware chained after `protect`
  checks `req.user.role`.
- **Password reset / email verification tokens**: random 32-byte tokens, only the
  SHA-256 hash is stored in the DB (mirrors how you'd never store a raw password) —
  the raw token only ever lives in the emailed link.

## Frontend integration notes

- Store the access token in memory / Redux (not localStorage — avoids XSS token theft).
- Axios instance should attach `Authorization: Bearer <accessToken>` and use an
  interceptor: on 401, call `/api/auth/refresh-token` (cookie sent automatically
  with `withCredentials: true`), retry the original request.
- On app load, silently call `/api/auth/refresh-token` to restore a session if the
  refresh cookie is still valid.

## Next steps to wire up

1. `npm install` and fill in `.env`
2. Point your React app's axios `baseURL` + `withCredentials: true` at this API
3. Build the frontend pages (Register, Login, Forgot/Reset Password, Verify Email)
   — happy to scaffold those next with the components list from your spec
   (LoginForm, RegisterForm, GoogleButton, ProtectedRoute, etc.)
