# 35 — Control panel shell and RBAC

**Phase:** 8 Frontend
**Depends on:** 33
**Spec:** `docs/README.md` §20
**Contract:** `docs/openapi.yaml` all admin tags

## Goal
The CP application shell with authentication, permission-gated navigation and generated API types.

## Scope
- Login with email, password and TOTP; token refresh; session expiry handling.
- App shell: navigation, country switcher, language switcher with `dir` from language metadata, theme.
- `npm run generate:api` producing types from `docs/openapi.yaml`; no hand-written response interfaces.
- Permission-gated routes and components mirroring backend permission codes.
- Shared table, filter, drawer, form and money-display primitives.

## Endpoints
All admin endpoints, read paths.

## Tables
None.

## Acceptance criteria
- [ ] Switching to Arabic flips the entire layout to RTL from the API `direction` field
- [ ] A user without a permission never sees the route and is also rejected by the API if they force the URL
- [ ] Generated types are regenerated in CI and a drift causes a build failure
- [ ] Money is formatted from currency metadata, never hardcoded

## Out of scope
Screen content. Tasks 36 and 37.
