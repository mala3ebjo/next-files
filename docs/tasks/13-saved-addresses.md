# 13 — Saved addresses

**Phase:** 2 Assets
**Depends on:** 09
**Spec:** `docs/README.md` §19.4
**Contract:** `docs/openapi.yaml` tag `Addresses`

## Goal
Clients store frequently used pickup and drop-off points.

## Scope
- CRUD scoped to the owner, with a map-pinned coordinate plus a free-text line.
- Plan limit enforcement using the `MAX_SAVED_ADDRESSES` benefit, including the UNLIMITED value type.
- Default address handling.

## Endpoints
`GET/POST /addresses`, `PATCH /addresses/{id}`, `DELETE /addresses/{id}`

## Tables
`saved_addresses`

## Acceptance criteria
- [ ] Exceeding the plan limit returns 422 with `SAVED_ADDRESS_LIMIT_REACHED`
- [ ] A Business plan with UNLIMITED is never blocked
- [ ] Deleting an address does not affect historical orders that referenced it

## Out of scope
Address autocomplete. That is a client-side maps concern.
