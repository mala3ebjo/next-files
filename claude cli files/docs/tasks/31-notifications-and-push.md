# 31 — Notifications and push

**Phase:** 6 Trust
**Depends on:** 05, 07
**Spec:** `docs/README.md` §16.3
**Contract:** `docs/openapi.yaml` tag `Notifications`

## Goal
Deliver every event to the right person, in their language, on their chosen channel.

## Scope
- Template registry, per-user category preferences, quiet hours per country.
- FCM adapter covering Android and iOS; SMS for critical only; email for invoices.
- All content as translation key plus params, rendered client-side.
- Deep links per template so a push opens the exact screen.
- SOS: alert to CP and configured contacts, high-priority ticket, pinned on the live map until resolved.

## Endpoints
`GET /notifications`, `POST /notifications/{id}/read`, `GET/PATCH /notifications/preferences`, `POST/DELETE /devices`, `POST /driver/sos`, `GET /admin/sos`, `POST /admin/sos/{id}/resolve`

## Tables
`notification_templates`, `notifications`, `notification_deliveries`, `notification_preferences`, `devices`, `sos_alerts`, `support_tickets`

## Acceptance criteria
- [ ] A notification body contains only keys and params, never a rendered sentence
- [ ] Quiet hours suppress push but still write the in-app entry
- [ ] A stale FCM token is detected and the device row cleaned up
- [ ] An SOS alert reaches the CP within two seconds and stays visible until resolved
- [ ] Delivery failures are recorded with a reason and retried per policy

## Out of scope
None.
