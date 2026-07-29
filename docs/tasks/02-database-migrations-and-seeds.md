# 02 — Database migrations and seeds

**Phase:** 0 Foundation
**Depends on:** 01
**Spec:** `docs/README.md` §18
**Contract:** `docs/openapi.yaml` none

## Goal
Apply the full schema and reference data so every later task has real tables to work against.

## Scope
- Copy `db/migration/V1..V12` and `R__seed_01..10` into `backend/src/main/resources/db/migration/`.
- Wire Flyway: validate on startup, no `flyway.clean` in any non-local profile.
- Add a Testcontainers base test class that boots MySQL 8, migrates, and is reused by every integration test.
- Add a `SchemaIT` that asserts migrations apply on an empty database and that repeatable seeds are idempotent across three runs.

## Endpoints
None.

## Tables
All 90 tables.

## Acceptance criteria
- [ ] `./gradlew flywayMigrate` succeeds on an empty schema
- [ ] Running the repeatable seeds three times leaves identical row counts
- [ ] `SchemaIT` passes under Testcontainers
- [ ] No migration file is edited after this task — new changes get a new `V13__`, `V14__`, ...

## Out of scope
Entities and repositories. Those arrive with their owning module.
