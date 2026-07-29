# 34 — Reporting and exports

**Phase:** 7 Ops
**Depends on:** 33
**Spec:** `docs/README.md` §20 Reports
**Contract:** `docs/openapi.yaml` tag `Admin Reports`

## Goal
Operational and financial reporting with async export.

## Scope
- The nine report types listed in the contract, backed by summary tables refreshed on a schedule rather than live aggregation.
- Grouping by day, week, month, country, corridor or carrier.
- Async CSV and XLSX export via `export_jobs` with a signed, expiring download URL.
- Scheduled email reports.

## Endpoints
`GET /admin/reports/{reportType}`, `POST /admin/reports/export`

## Tables
`export_jobs`, summary tables added in a new migration

## Acceptance criteria
- [ ] Every report runs against a read replica or a summary table, never a live scan of `orders`
- [ ] Export of 100k rows completes without holding a request thread
- [ ] Download URLs expire and are not guessable
- [ ] Financial report totals reconcile exactly with the ledger

## Out of scope
BI dashboards.
