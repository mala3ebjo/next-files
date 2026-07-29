# 15 — Corridors and cross-border pricing

**Phase:** 3 Pricing
**Depends on:** 14
**Spec:** `docs/README.md` §12
**Contract:** `docs/openapi.yaml` tag `Orders`

## Goal
Split a cross-border shipment into legs and price each country plus the corridor fee bundle.

## Scope
- Detect pickup and drop-off countries and resolve the corridor and crossing.
- Build one `order_legs` row per country segment.
- Apply the origin rate card to its segment and the destination rate card to its segment.
- Resolve the corridor fee bundle by corridor, vehicle type and cargo type, honouring effective dates.
- FX conversion to the settlement currency (pickup country) with the rate snapshotted onto the quote.
- Corridor eligibility filter used later by dispatch: permit, passport validity, plate country, document validity.
- Required customs document checklist per corridor.

## Endpoints
`POST /orders/quote` (cross-border path), `GET /catalog/corridors`

## Tables
`corridors`, `border_crossings`, `corridor_fees`, `corridor_documents`, `order_legs`, `fx_rates`

## Acceptance criteria
- [ ] An Istanbul to Baghdad quote returns two legs, one crossing and an itemised corridor fee bundle
- [ ] Settlement currency is always the pickup country currency
- [ ] The FX rate is stored on the quote and reused forever, so an old order never changes value
- [ ] A route with no active corridor returns 422 `CORRIDOR_NOT_SUPPORTED`
- [ ] Corridor fees respect `effective_from` and `effective_to`

## Out of scope
Border document upload during the trip. Task 20.
