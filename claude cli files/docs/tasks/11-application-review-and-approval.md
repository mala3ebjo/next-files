# 11 — Application review and approval

**Phase:** 1 Identity
**Depends on:** 10
**Spec:** `docs/README.md` §8, §19.3
**Contract:** `docs/openapi.yaml` tag `Admin Applications`

## Goal
Admins approve, request changes, or reject carrier applications, and approval provisions the whole carrier.

## Scope
- Review queue with filters and a detail view exposing submitted data, document preview URLs and duplicate warnings.
- Approve: create `carrier_profiles`, `drivers` and `vehicles` rows, the wallet, the organisation portal user for companies, assign the Bronze tier, and flip the user to full token scope.
- Request changes: set `CHANGES_REQUESTED` with `reasonKeys` and per-field notes so the applicant sees them in their own language.
- Reject with reason keys.
- Notify the applicant on every outcome.

## Endpoints
`GET /admin/applications`, `GET /admin/applications/{id}`, `POST .../approve`, `POST .../request-changes`, `POST .../reject`

## Tables
`carrier_applications`, `carrier_profiles`, `drivers`, `vehicles`, `organizations`, `organization_members`, `wallets`, `documents`

## Acceptance criteria
- [ ] Approving a fleet with five declared trucks creates five vehicle rows, one organisation, one `FLEET_OWNER` user and one wallet
- [ ] After approval the applicant's next token refresh returns FULL scope and `nextScreen = HOME`
- [ ] Requesting changes returns the applicant to the wizard with the flagged fields marked
- [ ] Every outcome writes an audit row and sends a notification
- [ ] Approval is idempotent — a second call does not duplicate rows

## Out of scope
Ongoing carrier suspension. Task 29.
