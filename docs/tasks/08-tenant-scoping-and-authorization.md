# 08 — Tenant scoping and authorization

**Phase:** 1 Identity
**Depends on:** 07
**Spec:** `docs/README.md` §7.5
**Contract:** `docs/openapi.yaml` none

## Goal
Make it structurally impossible for one organisation to read another's rows.

## Scope
- Hibernate filter applied from the authenticated principal's `orgId` to every organisation-scoped entity.
- `@PreAuthorize` on every controller method; a test that fails the build if any non-public endpoint lacks one.
- Ownership guards: client reads own orders, driver reads assigned orders only.
- `AuditAspect` writing `audit_logs` on every CP write with actor, IP, before/after diff.

## Endpoints
None directly. Applies to every endpoint.

## Tables
`audit_logs`

## Acceptance criteria
- [ ] An integration test proves fleet A cannot read fleet B's orders, drivers, vehicles or wallet, for every scoped endpoint
- [ ] A test enumerates all controller methods and fails on any missing `@PreAuthorize` outside the public allowlist
- [ ] Every CP write produces exactly one audit row with a populated diff
- [ ] Audit rows are never updated or deleted

## Out of scope
The audit viewer UI. Task 37.
