# 29 — Violation and compliance engine

**Phase:** 6 Trust
**Depends on:** 19, 20, 25
**Spec:** `docs/README.md` §15
**Contract:** `docs/openapi.yaml` tag `Admin Compliance`

## Goal
Detect rule breaches automatically, apply graduated consequences, and let carriers appeal.

## Scope
- Detector framework: real-time detectors on events plus scheduled scanners.
- Implement every rule seeded in `R__seed_08`: offers, trip, proof, money, documents, conduct and border groups.
- Points with decay after `window_days`; evidence JSON captured on every violation.
- Auto-actions limited to WARNING, PRIORITY_DROP and PAYOUT_HOLD. SUSPENSION and DEACTIVATION are only ever applied through the admin endpoint.
- Repeat escalation, fleet aggregation to the company, appeal submission and resolution.
- Dismissal removes points retroactively and reverses any automatic action.

## Endpoints
`GET/POST /admin/violation-rules`, `PATCH /admin/violation-rules/{id}`, `GET /admin/violations`, `POST .../confirm`, `/dismiss`, `GET /admin/appeals`, `POST /admin/appeals/{id}/resolve`, `GET /driver/violations`, `POST /driver/violations/{id}/appeal`

## Tables
`violation_rules`, `violations`, `violation_actions`, `violation_appeals`, `carrier_profiles`

## Acceptance criteria
- [ ] Every seeded rule has a detector and a test that triggers it and one that does not
- [ ] No code path can suspend or deactivate a carrier automatically — proven by a test that runs every detector and asserts no such action is created
- [ ] Points decay after the window and the carrier's score recovers
- [ ] Dismissing a violation reverses the priority drop and restores the score
- [ ] Every violation stores evidence sufficient to justify it in an appeal

## Out of scope
None.
