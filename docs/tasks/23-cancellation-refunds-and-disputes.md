# 23 — Cancellation, refunds and disputes

**Phase:** 4 Orders
**Depends on:** 18, 24
**Spec:** `docs/README.md` §9, §13.5, §19.9
**Contract:** `docs/openapi.yaml` tags `Orders`, `Admin Orders`

## Goal
Handle every way an order can end badly, with correct money movement.

## Scope
- Client cancellation with the fee table from spec §13.5, including free cancellations from the plan benefit.
- Driver cancellation: full refund, violation, re-dispatch.
- Admin cancellation with an explicit refund policy.
- Dispute open and resolve with settlement outcomes.
- All refunds through the gateway or to wallet, with balanced ledger entries.

## Endpoints
`POST /orders/{id}/cancel`, `POST /admin/orders/{id}/cancel`, `/resolve-dispute`, `/reprice`, `POST /admin/payments/{id}/refund`

## Tables
`order_cancellations`, `refunds`, `payments`, `ledger_entries`, `subscriptions`

## Acceptance criteria
- [ ] Cancelling before assignment refunds in full with no fee
- [ ] Cancelling after assignment applies the country cancellation percentage
- [ ] A free cancellation from the plan consumes one allowance and charges nothing
- [ ] Every refund path produces balanced ledger entries
- [ ] Repricing creates an explicit adjustment entry and never mutates the original quote

## Out of scope
None.
