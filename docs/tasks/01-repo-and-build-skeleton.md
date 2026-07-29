# 01 — Repo and build skeleton

**Phase:** 0 Foundation
**Depends on:** none
**Spec:** `docs/README.md` §4.1, §5
**Contract:** `docs/openapi.yaml` none

## Goal
Create the multi-module Gradle backend, the React control panel shell, and the KMP mobile project so every later task has a place to put code.

## Scope
- Gradle multi-project: `app-bootstrap`, `common/{core,security,web,i18n}`, `modules/*`, `integrations/*` exactly as in spec §4.1.
- Version catalog (`libs.versions.toml`) and convention plugins. Java 21 toolchain.
- Spring Boot 3.x app that starts, exposes `/actuator/health`, and connects to MySQL and Redis.
- `docker-compose.dev.yml`: MySQL 8, Redis, MinIO, Mailhog.
- Control panel: Vite + React + TS + Tailwind + shadcn/ui, routing shell, `npm run generate:api` wired to `docs/openapi.yaml`.
- Mobile: KMP project with every `core/`, `feature/`, `client/`, `driver/`, `apps/` module created empty but building for Android and iOS.
- Spotless / ktlint / ESLint + Prettier configured.

## Endpoints
`GET /actuator/health` only.

## Tables
None.

## Acceptance criteria
- [ ] `./gradlew build` passes from a clean clone
- [ ] `docker compose -f infra/docker-compose.dev.yml up -d` then `bootRun` starts with no errors
- [ ] `npm run build` produces a CP bundle
- [ ] `./gradlew :mobile:apps:client:androidApp:assembleDebug` and the driver equivalent both succeed
- [ ] `spotlessApply` and lint are clean

## Out of scope
Any business logic. This task creates structure only.
