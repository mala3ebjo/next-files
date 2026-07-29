# 19 — Dispatch engine

**Phase:** 4 Orders
**Depends on:** 17, 12
**Spec:** `docs/README.md` §10
**Contract:** `docs/openapi.yaml` tags `Driver`, `Admin Orders`

## Goal
Broadcast orders to eligible nearby carriers, first accept wins, escalate to manual when nobody takes it.

## Scope
- Redis GEO index of available drivers, updated from location ingest.
- Eligibility filter: country, vehicle type, capacity, document validity, corridor permit for cross-border, not suspended, no payout hold, cash exposure under the country limit.
- Ranking: distance, tier priority weight, acceptance rate, rating, minus open violation points. Store the component breakdown on every offer.
- Round loop driven by country config: radius list, offer TTL, drivers per round, max rounds.
- Atomic acceptance: `UPDATE ... WHERE status = 'SEARCHING'` so concurrent accepts cannot double-assign.
- Fleet-level offers with an assignment window, returning to the pool on timeout.
- Broker claim board and re-assignment with margin capped by country config.
- Scheduled orders entering the pipeline at `dispatch_due_at`.
- Escalation to the manual dispatch queue and admin force-assign and rebroadcast.

## Endpoints
`GET /driver/offers`, `POST /driver/offers/{id}/accept`, `POST /driver/offers/{id}/reject`, `POST /fleet/orders/{id}/assign`, `GET /broker/board`, `POST /broker/orders/{id}/claim`, `POST /broker/orders/{id}/assign-carrier`, `GET /admin/dispatch/queue`, `GET /admin/dispatch/{orderId}/candidates`, `POST /admin/dispatch/{orderId}/rebroadcast`, `POST /admin/orders/{id}/assign`

## Tables
`order_offers`, `dispatch_attempts`, `orders`, `drivers`, `carrier_profiles`

## Acceptance criteria
- [ ] A concurrency test with 50 simultaneous accepts produces exactly one assignment and 49 `OFFER_TAKEN`
- [ ] A driver with an expired licence never receives an offer
- [ ] A driver holding cash above the country limit never receives a COD offer
- [ ] Exhausting all rounds moves the order to the manual queue, not to `UNFULFILLED` silently
- [ ] Every offer stores a score breakdown that support can read back
- [ ] Broker margin above the country cap returns 422

## Out of scope
Live map rendering. Task 21.
