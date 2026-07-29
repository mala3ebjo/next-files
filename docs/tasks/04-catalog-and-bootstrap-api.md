# 04 — Catalog and bootstrap API

**Phase:** 0 Foundation
**Depends on:** 02, 03
**Spec:** `docs/README.md` §6.2, §6.3, §19.1
**Contract:** `docs/openapi.yaml` tag `Config`

## Goal
Serve countries, currencies, vehicle types, cargo types, corridors and feature flags so the apps can boot and so nothing downstream hardcodes them.

## Scope
- Entities and repositories for `countries`, `currencies`, `fx_rates`, `vehicle_types`, `cargo_types`, `zones`, `corridors`, `border_crossings`, `feature_flags`, `payout_methods`.
- `GET /config/bootstrap` assembling countries, languages, flags, min/latest app version and force-update.
- Catalog read endpoints filtered by country.
- `CountryConfigService`: the single place any code reads commission %, cancellation %, COD flag, dispatch radii, offer TTL, quote TTL, cash limit. Cached in Redis with explicit eviction on admin write.
- `FxService`: resolve rate + platform margin for a currency pair at a point in time.

## Endpoints
`GET /config/bootstrap`, `GET /catalog/countries`, `GET /catalog/vehicle-types`, `GET /catalog/cargo-types`, `GET /catalog/corridors`

## Tables
`countries`, `currencies`, `fx_rates`, `vehicle_types`, `country_vehicle_types`, `cargo_types`, `zones`, `border_crossings`, `corridors`, `feature_flags`, `payout_methods`, `country_payment_methods`, `country_payout_methods`

## Acceptance criteria
- [ ] Bootstrap responds in under 200 ms warm
- [ ] Only `is_active = 1` countries are returned to apps; admin endpoints see all
- [ ] `CountryConfigService` is the only reader of country configuration columns — verified by an ArchUnit test
- [ ] Changing a country in the CP evicts the cache within one request
- [ ] Integration tests cover an active country, an inactive country and an unknown country code

## Out of scope
Admin write endpoints for the catalog. Those are task 33.
