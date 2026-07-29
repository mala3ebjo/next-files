# 28 — Carrier tiers and scoring

**Phase:** 5 Money
**Depends on:** 19, 24
**Spec:** `docs/README.md` §14.2
**Contract:** `docs/openapi.yaml` tags `Admin Plans`

## Goal
Compute earned tiers from activity and apply their benefits.

## Scope
- Nightly scoring job over the metrics and weights in `tier_scoring_rules`, writing `carrier_score_history`.
- Tier assignment from `min_score`, with notification and reason on change.
- Manual admin override with expiry and reason.
- Tier benefits consumed by commission, dispatch priority, payout hold and cash limit.

## Endpoints
`GET/PUT /admin/carrier-tiers`, `GET/PUT /admin/tier-rules`, `POST /admin/carriers/{id}/tier`

## Tables
`carrier_tiers`, `tier_scoring_rules`, `carrier_score_history`, `carrier_profiles`

## Acceptance criteria
- [ ] Changing a weight changes the next computed score, with no code change
- [ ] A manual override survives the nightly job until it expires
- [ ] Tier change sends a notification stating the reason
- [ ] Commission actually charged reflects the tier discount, verified end to end on an order

## Out of scope
None.
