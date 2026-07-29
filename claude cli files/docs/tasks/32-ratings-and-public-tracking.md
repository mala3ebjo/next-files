# 32 — Ratings and public tracking

**Phase:** 6 Trust
**Depends on:** 20
**Spec:** `docs/README.md` §17
**Contract:** `docs/openapi.yaml` tags `Orders`, `Tracking`

## Goal
Two-way ratings and a safe shareable tracking page.

## Scope
- Rating submission by both sides, mutual visibility rule, configurable window, auto-close.
- Rolling averages feeding tier score and the low-rating violation rule.
- Public tracking: 128-bit opaque token, auto-disable on delivery, revocable, rate-limited, `noindex`.
- The public payload exposes no phone numbers, no full addresses, and a masked plate.

## Endpoints
`POST /orders/{id}/rate`, `POST/DELETE /orders/{id}/tracking-link`, `GET /track/{token}`

## Tables
`order_ratings`, `order_tracking_links`

## Acceptance criteria
- [ ] A rating is invisible to the other party until both submit or the window closes
- [ ] A schema-level test asserts the public tracking response contains no field carrying a phone number
- [ ] The link returns 410 immediately after delivery
- [ ] Token enumeration is infeasible and rate limiting triggers under a burst
- [ ] Revoking from the CP disables the link instantly

## Out of scope
None.
