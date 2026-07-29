# 33 — Admin API, staff and system settings

**Phase:** 7 Ops
**Depends on:** 08, 29
**Spec:** `docs/README.md` §19.9, §20
**Contract:** `docs/openapi.yaml` tags `Admin *`

## Goal
Complete the control panel API surface: dashboard, users, catalog writes, staff, roles, flags and audit.

## Scope
- Dashboard KPIs and the ops alert feed.
- User and carrier search, suspend, activate, deactivate.
- Catalog write endpoints: countries, FX rates, vehicle types, cargo types.
- Language and translation editing, publish bundle version.
- Staff CRUD, role permission editing, permission catalog.
- Feature flag management and the audit log viewer API.

## Endpoints
`GET /admin/dashboard`, `/admin/users`, `/admin/carriers`, `POST .../suspend`, `/activate`, `/deactivate`, catalog CRUD, `/admin/translations`, `/admin/languages`, `/admin/staff`, `/admin/roles`, `/admin/permissions`, `/admin/feature-flags`, `/admin/audit-logs`

## Tables
All admin-facing tables.

## Acceptance criteria
- [ ] `ADMIN` cannot reach `role.manage`, `admin.manage`, `country.manage` or `featureflag.manage`
- [ ] Every write in this task produces an audit row
- [ ] Suspending a carrier immediately stops new offers reaching them
- [ ] Editing a role's permissions changes access without a restart
- [ ] Dashboard queries stay under 500 ms on a seeded dataset of 100k orders

## Out of scope
The UI. Tasks 35 to 37.
