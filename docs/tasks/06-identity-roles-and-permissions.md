# 06 — Identity, roles and permissions

**Phase:** 1 Identity
**Depends on:** 03, 04
**Spec:** `docs/README.md` §2, §3, §7.5
**Contract:** `docs/openapi.yaml` tags `Profile`

## Goal
Model users, roles and granular permissions, and expose the current-user endpoint.

## Scope
- Entities for `users`, `roles`, `permissions`, `role_permissions`, `user_roles`, `user_country_scope`.
- `PermissionService` resolving the effective permission set for a user, cached per token version.
- `GET /me` and `PATCH /me` returning roles, permissions, organisation, client or carrier profile.
- Seed verification test asserting the seeded matrix matches spec §3 exactly.

## Endpoints
`GET /me`, `PATCH /me`

## Tables
`users`, `roles`, `permissions`, `role_permissions`, `user_roles`, `user_country_scope`

## Acceptance criteria
- [ ] `GET /me` returns the same permission codes the JWT carries
- [ ] Changing a role's permissions takes effect for existing users without a redeploy
- [ ] A test asserts every permission code used in any `@PreAuthorize` exists in the `permissions` table
- [ ] `PATCH /me` cannot change `userKind`, `roles` or `status`

## Out of scope
Staff user CRUD. That is task 33.
