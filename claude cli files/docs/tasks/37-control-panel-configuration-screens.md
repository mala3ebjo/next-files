# 37 — Control panel configuration screens

**Phase:** 8 Frontend
**Depends on:** 35
**Spec:** `docs/README.md` §20
**Contract:** `docs/openapi.yaml` `Admin Pricing`, `Admin Catalog`, `Admin Localization`, `Admin Plans`, `Admin System`

## Goal
The screens that let the business change behaviour without a deploy.

## Scope
- Pricing: rate card versions, factor editor grouped by category, price simulator, publish with impact diff, corridor and corridor-fee editors, customs checklist editor.
- Catalog: countries with all their toggles, currencies, FX rates, vehicle and cargo types, zones, border crossings.
- Localization: language list, translation editor with search and missing-key report, CSV import and export, publish bundle.
- Plans and tiers: subscription plans with per-benefit toggles, tier thresholds and scoring weights.
- System: staff, role permission editor, feature flags, audit log viewer, notification templates.

## Endpoints
All configuration admin endpoints.

## Tables
None.

## Acceptance criteria
- [ ] Publishing a rate card requires viewing the impact diff first
- [ ] The simulator returns a breakdown identical in structure to a real quote
- [ ] The missing-key report is empty for English and Arabic before release
- [ ] Every configuration change is visible in the audit viewer within seconds

## Out of scope
None.
