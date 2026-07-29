# 26 — Payouts and per-country rails

**Phase:** 5 Money
**Depends on:** 24, 25
**Spec:** `docs/README.md` §13.4
**Contract:** `docs/openapi.yaml` tag `Money`

## Goal
Pay carriers on demand or at a threshold, through whichever rail their country supports.

## Scope
- `PayoutProvider` abstraction with adapters for bank/IBAN, internal wallet, and at least one local rail.
- Payout account CRUD with `accountFields` validated against the country method definition regex.
- On-demand request plus a threshold job. No fixed payout day.
- Blocking rules: payout hold, unverified account, unsettled COD over limit, order under dispute, below minimum.
- Auto-approve under a limit, `FINANCE` approval above it.
- Tier-based hold period.

## Endpoints
`GET/POST/DELETE /payout-accounts`, `POST /payouts/request`, `GET /payouts`, `GET /admin/payouts`, `POST /admin/payouts/{id}/approve`, `/reject`

## Tables
`payout_accounts`, `payouts`, `payout_items`, `payout_methods`, `country_payout_methods`, `ledger_entries`

## Acceptance criteria
- [ ] Each blocking rule has its own test and its own error code
- [ ] Adding an IBAN that fails the country regex returns 422
- [ ] An approved payout moves funds to `PAYOUT_CLEARING` with balanced entries
- [ ] Adding a new rail requires only a row plus one adapter class, proven by adding a test rail
- [ ] A Platinum carrier's hold period is shorter than a Bronze carrier's, driven by tier data

## Out of scope
None.
