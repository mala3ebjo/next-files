# 36 — Control panel operations screens

**Phase:** 8 Frontend
**Depends on:** 35
**Spec:** `docs/README.md` §20
**Contract:** `docs/openapi.yaml` `Admin Dashboard`, `Admin Orders`, `Admin Applications`, `Admin Users`, `Admin Finance`, `Admin Compliance`

## Goal
The screens the operations team lives in every day.

## Scope
- Overview with KPIs, trends and the alert feed.
- Dispatch board with the unassigned queue, candidate list with score breakdown and force assign.
- Orders table and detail drawer: timeline, map trail, stops, cargo, price breakdown, payments, proofs, documents, chat transcript, violations, audit.
- Live map with clustering, status colours and pinned SOS alerts.
- Application review with side-by-side data and document previews.
- Carriers, clients, vehicles.
- Finance: payments, refunds, COD ledger, payout approvals.
- Compliance: violation feed, pending decisions, appeals.

## Endpoints
All operational admin endpoints.

## Tables
None.

## Acceptance criteria
- [ ] Every list is server-paginated and filtered; no screen fetches all rows
- [ ] The live map handles 500 concurrent drivers without dropping frames
- [ ] The order drawer shows the exact same price breakdown the client saw
- [ ] Suspension and deactivation are visibly distinct actions requiring explicit confirmation and a reason

## Out of scope
Configuration screens. Task 37.
