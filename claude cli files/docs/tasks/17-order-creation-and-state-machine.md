# 17 — Order creation and state machine

**Phase:** 4 Orders
**Depends on:** 14, 15
**Spec:** `docs/README.md` §9, §19.4
**Contract:** `docs/openapi.yaml` tag `Orders`

## Goal
Turn a valid quote into an order and govern every subsequent transition.

## Scope
- `POST /orders` consuming a quote exactly once; expired or reused quotes are rejected.
- Persist stops, legs, cargo; generate per-stop 4-digit verification codes stored hashed.
- Human-readable order code generator.
- `OrderStateMachine` implementing spec §9 exactly: allowed transitions, guards, and the events emitted on each.
- `order_status_history` written on every transition with actor and label key.
- Scheduled orders: compute `dispatch_due_at` from country lead time.
- Order read endpoints for client, driver and admin with the correct field visibility per audience.

## Endpoints
`POST /orders`, `GET /orders`, `GET /orders/{id}`, `GET /admin/orders`, `GET /admin/orders/{id}`

## Tables
`orders`, `order_stops`, `order_legs`, `order_cargo`, `order_status_history`, `price_quotes`

## Acceptance criteria
- [ ] A test enumerates every illegal transition pair and asserts each is rejected with `INVALID_STATE_TRANSITION`
- [ ] `order.setStatus(...)` appears nowhere outside the state machine — enforced by an ArchUnit test
- [ ] Reusing a consumed quote returns 409 `QUOTE_ALREADY_USED`
- [ ] Verification codes are stored hashed and never returned to the driver
- [ ] A client sees only their own orders; a driver only assigned ones

## Out of scope
Payment and dispatch. Tasks 18 and 19.
