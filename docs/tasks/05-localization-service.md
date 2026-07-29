# 05 — Localization service

**Phase:** 0 Foundation
**Depends on:** 02, 03
**Spec:** `docs/README.md` §6.1, §19.1
**Contract:** `docs/openapi.yaml` tag `Config`

## Goal
Serve server-driven translation bundles so no user-facing string ever ships inside an app binary.

## Scope
- `GET /i18n/languages` returning code, native name, `direction`, `bundleVersion`.
- `GET /i18n/bundle?lang=&sinceVersion=` with delta support and `removedKeys`.
- `MessageKeyResolver` used by notification and report code to build key + params, never sentences.
- Bundle caching in Redis keyed by `lang:version`; publishing a new version increments `bundle_version` and evicts.
- A build-time check that scans backend and mobile source for hardcoded user-facing literals and fails the build on a hit.

## Endpoints
`GET /i18n/languages`, `GET /i18n/bundle`

## Tables
`languages`, `translations`

## Acceptance criteria
- [ ] Unsupported `lang` falls back to English rather than erroring
- [ ] A delta request returns only changed keys plus `removedKeys`
- [ ] `direction` is served from the database, never inferred from the language code
- [ ] The hardcoded-string check fails the build when a literal is introduced
- [ ] Missing-key report endpoint lists untranslated keys per language

## Out of scope
The CP translation editor. That is task 37.
