# 25 — Cash on delivery

**Phase:** 5 Money
**Depends on:** 20, 24
**Spec:** `docs/README.md` §13.3
**Contract:** `docs/openapi.yaml` tag `Money`

## Goal
Track cash the driver holds and settle it, with the whole feature toggleable per country.

## Scope
- Create a `cod_collections` row on delivery of a COD order.
- Cash exposure tracking on `carrier_profiles.cod_held_minor` and a limit check consumed by dispatch.
- Two settlement paths, both implemented and both CP-toggleable: bank deposit with slip upload and finance verification, office handover recorded by staff.
- Commission on COD orders deducted from the next payout rather than collected in cash.
- Overdue detection feeding the violation engine.

## Endpoints
`GET /cod/held`, `POST /cod/{id}/submit`, `GET /admin/cod`, `POST /admin/cod/{id}/settle`

## Tables
`cod_collections`, `ledger_entries`, `carrier_profiles`

## Acceptance criteria
- [ ] With COD disabled for a country, no COD order can be created at all
- [ ] Holding cash above the limit blocks further COD offers
- [ ] Settlement posts balanced entries and reduces the held amount to zero
- [ ] An unsettled collection past its grace period becomes `OVERDUE`
- [ ] Enabling COD for one country does not enable it anywhere else

## Out of scope
None.
