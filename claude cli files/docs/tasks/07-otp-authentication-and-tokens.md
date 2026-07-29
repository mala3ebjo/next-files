# 07 — OTP authentication and tokens

**Phase:** 1 Identity
**Depends on:** 06
**Spec:** `docs/README.md` §7.1–§7.4, §19.2
**Contract:** `docs/openapi.yaml` tag `Auth`

## Goal
Phone + OTP login for app users, email + password + TOTP for staff, with rotating refresh tokens.

## Scope
- `POST /auth/otp/request` with Redis throttling: 3 per hour per phone, 10 per day per IP, silent lockout on abuse.
- OTP hashed at rest, 120 s TTL, max 5 attempts.
- `POST /auth/otp/verify` issuing an access JWT (15 min) and an opaque rotating refresh token (60 days), registering the device.
- Refresh rotation with reuse detection: replaying a consumed token revokes the whole `family_id`.
- `tokenScope` FULL vs LIMITED, and the `AuthContext` (`status`, `nextScreen`, `reasonKeys`) the apps use to route.
- JWT claims per spec §7.4 including `ver`; bumping `users.token_version` invalidates all live tokens.
- Staff login with TOTP second factor; 2FA mandatory for `SUPER_ADMIN`, `ADMIN`, `FINANCE`.
- Session list and revoke endpoints.
- `SmsProvider` interface plus one adapter; a logging adapter for local development.

## Endpoints
`POST /auth/otp/request`, `POST /auth/otp/verify`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/sessions`, `DELETE /auth/sessions/{sessionId}`, `POST /auth/cp/login`, `POST /auth/cp/2fa/verify`

## Tables
`otp_requests`, `refresh_tokens`, `devices`, `users`

## Acceptance criteria
- [ ] Requesting a fourth OTP within an hour returns 429 with `Retry-After`
- [ ] A sixth wrong code invalidates the challenge
- [ ] Replaying a used refresh token revokes the family and forces re-login — covered by a test
- [ ] Bumping `token_version` rejects a previously valid access token on the next request
- [ ] A carrier with `PENDING_REVIEW` receives a LIMITED token and `nextScreen = WAITING_APPROVAL`
- [ ] No OTP code and no phone number appears in any log line

## Out of scope
Registration itself. Tasks 09 and 10.
