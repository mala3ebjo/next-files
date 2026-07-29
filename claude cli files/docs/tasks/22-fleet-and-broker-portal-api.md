# 22 — Fleet and broker portal API

**Phase:** 4 Orders
**Depends on:** 19, 12
**Spec:** `docs/README.md` §2.2, §19.6
**Contract:** `docs/openapi.yaml` tags `Fleet`, `Broker`

## Goal
Give companies a scoped view of their own operation.

## Scope
- Fleet overview KPIs, order list, driver assignment, live map limited to own drivers, wallet, violations.
- Broker claim board, claim, re-assign to a contracted carrier, and margin recording as a separate ledger entry.
- Broker to carrier contract management.

## Endpoints
`GET /fleet/overview`, `/fleet/orders`, `/fleet/live-map`, `/fleet/violations`, `GET /broker/board`, `POST /broker/orders/{id}/claim`, `/assign-carrier`

## Tables
`organizations`, `organization_members`, `broker_carrier_contracts`, `orders`, `ledger_entries`

## Acceptance criteria
- [ ] Every fleet and broker endpoint is proven scoped by a cross-tenant test
- [ ] Broker margin appears as its own ledger entry, leaving client price, carrier payout and platform commission separately traceable
- [ ] A broker cannot assign a carrier it has no active contract with

## Out of scope
The portal UI. Task 36.
