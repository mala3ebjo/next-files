# 16 — Rate card administration and simulation

**Phase:** 3 Pricing
**Depends on:** 14, 15
**Spec:** `docs/README.md` §11.2, §19.7
**Contract:** `docs/openapi.yaml` tag `Admin Pricing`

## Goal
Let admins edit pricing safely, with a simulator and an impact preview before publishing.

## Scope
- Draft rate cards, optional clone from an existing version, factor editor, publish with effective dates.
- Published versions are immutable; editing creates a new draft version.
- `POST /admin/pricing/simulate` returning the same breakdown structure as a real quote.
- `GET /admin/rate-cards/{id}/diff` re-pricing a sample of recent orders and reporting average, median and extreme changes.
- Corridor and corridor-fee CRUD, and the corridor document checklist editor.

## Endpoints
`GET/POST /admin/rate-cards`, `GET/PUT /admin/rate-cards/{id}/factors`, `POST .../publish`, `GET .../diff`, `POST /admin/pricing/simulate`, `GET/POST /admin/corridors`, `GET/PUT /admin/corridors/{id}/fees`, `PUT /admin/corridors/{id}/documents`

## Tables
`rate_cards`, `pricing_factors`, `corridors`, `corridor_fees`, `corridor_documents`

## Acceptance criteria
- [ ] Editing a PUBLISHED card returns 409 `RATE_CARD_PUBLISHED`
- [ ] Publishing a new version does not change the price of any existing order
- [ ] The diff endpoint returns a plausible average change on seeded sample data
- [ ] Every publish writes an audit row with the full factor set

## Out of scope
The CP pricing UI. Task 37.
