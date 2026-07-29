# 12 — Drivers, vehicles and documents

**Phase:** 2 Assets
**Depends on:** 11
**Spec:** `docs/README.md` §18.2, §19.6
**Contract:** `docs/openapi.yaml` tags `Fleet`, `Driver`

## Goal
Manage the fleet roster and keep document validity visible.

## Scope
- CRUD for fleet drivers and vehicles, scoped to the caller's organisation.
- Vehicle to driver assignment history.
- Document upload, replacement and admin verification.
- `DocumentValidityService`: computes whether a driver or vehicle is currently compliant and the soonest expiry.
- Scheduled job raising expiry alerts at configurable day offsets. Expiry raises alerts and blocks nothing by itself.

## Endpoints
`GET/POST /fleet/drivers`, `PATCH /fleet/drivers/{id}`, `GET/POST /fleet/vehicles`, `PATCH /fleet/vehicles/{id}`, `GET /driver/vehicle`, `GET /admin/vehicles`, `POST /admin/vehicles/{id}/verify`

## Tables
`drivers`, `vehicles`, `vehicle_documents` via `documents`, `vehicle_assignments`, `vehicle_cargo_types`

## Acceptance criteria
- [ ] A fleet dispatcher cannot see another fleet's drivers — covered by a scoping test
- [ ] `documentsValid` flips to false the day a mandatory document expires
- [ ] Expiry alerts fire once per document per offset, never repeatedly
- [ ] Reassigning a vehicle closes the previous assignment row with `released_at`

## Out of scope
Using compliance to gate dispatch. That is enforced in task 19.
