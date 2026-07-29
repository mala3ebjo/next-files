# 14 — Pricing engine core

**Phase:** 3 Pricing
**Depends on:** 04
**Spec:** `docs/README.md` §11, §19.4
**Contract:** `docs/openapi.yaml` tag `Orders` (quote)

## Goal
Compute a price entirely from database factors and freeze it into an immutable quote.

## Scope
- `RateCardResolver`: active card for a country at a moment in time.
- `PriceCalculator` applying the exact order from spec §11: base, distance (with tiered bands), weight, vehicle multiplier, cargo multiplier, zone multiplier, time multiplier, stop fees, surcharges, min-fare floor, discounts, tax.
- Capacity guard producing `ORDER_WEIGHT_EXCEEDS_CAPACITY` with the max capacity in `params`.
- Restricted-cargo and refrigeration matching against vehicle type.
- Promo code validation and application.
- Persist the complete breakdown into `price_quotes.breakdown` and never recompute it afterwards.
- Quote TTL from country config.

## Endpoints
`POST /orders/quote`

## Tables
`rate_cards`, `pricing_factors`, `price_quotes`, `promo_codes`

## Acceptance criteria
- [ ] Golden tests: fixed inputs produce an exact expected breakdown, including tiered distance bands and the min-fare floor
- [ ] A client-supplied price in the request body is ignored entirely
- [ ] Weight above vehicle capacity returns 422 with the capacity in `params`
- [ ] The stored breakdown is byte-identical to what the API returned
- [ ] Rounding follows the currency `decimal_digits`; IQD produces no fractional minor units
- [ ] Every money value in the calculator is `long` or `BigDecimal`, never `double`

## Out of scope
Cross-border legs. Task 15.
