# 20 — Trip execution and proofs

**Phase:** 4 Orders
**Depends on:** 17, 19
**Spec:** `docs/README.md` §9.2, §12.3, §19.5
**Contract:** `docs/openapi.yaml` tag `Driver`

## Goal
Drive the order from assignment to delivery with verifiable proof at every stage.

## Scope
- Start trip, geofence arrival, pickup with code plus photos, intermediate stop completion, delivery with photos, signature and code.
- Geofence validation against `order_stops.geofence_radius_m`, mock-location flag capture, device-versus-server clock skew capture.
- Border flow: `AT_BORDER`, customs document upload against the corridor checklist, admin verification, `CUSTOMS_CLEARANCE`, then the next leg.
- Custody handover recording when a carrier swaps driver or vehicle mid-order.
- Driver-initiated cancellation returning the order to dispatch and raising a violation.
- Offline queue contract: proofs accept a client timestamp and are replayable without duplication.

## Endpoints
`POST /driver/orders/{id}/start`, `/arrived/{stopId}`, `/pickup`, `/stops/{stopId}/complete`, `/deliver`, `/border/documents`, `/cancel`, `POST /fleet/orders/{id}/handover`

## Tables
`order_proofs`, `order_stops`, `order_legs`, `order_handovers`, `documents`, `orders`

## Acceptance criteria
- [ ] Delivery without the required photo returns 422 `PROOF_PHOTO_REQUIRED`
- [ ] A wrong verification code returns 422 and increments an attempt counter
- [ ] Completing outside the geofence is recorded and flagged, not silently accepted
- [ ] Replaying the same proof submission twice creates one proof row
- [ ] A cross-border order cannot leave `CUSTOMS_CLEARANCE` until every mandatory document is verified
- [ ] A handover writes a timeline entry visible to the client

## Out of scope
Violation detection from these signals. Task 29.
