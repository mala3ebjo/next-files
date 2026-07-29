# 38 — Mobile core modules

**Phase:** 8 Frontend
**Depends on:** 04, 05, 07
**Spec:** `docs/README.md` §21.1, §21.4
**Contract:** `docs/openapi.yaml` tags `Config`, `Auth`

## Goal
Build the shared KMP foundation both apps sit on.

## Scope
- `:core:designsystem` tokens, typography, RTL-aware spacing, dark mode; `:core:icons`; `:core:ui` primitives including the stepper, capacity warning and state screens.
- `:core:network` Ktor engine, auth interceptor, token refresh with single-flight, error mapping to typed errors; `:core:api` generated services and mappers, kept separate.
- `:core:model`, `:core:common` validators and money formatting from currency metadata.
- `:core:localization` bundle fetch, cache, OS-locale match, English fallback, direction application.
- `:core:database` SQLDelight cache and outbox; `:core:datastore` secure token storage.
- `:core:location`, `:core:maps`, `:core:realtime`, `:core:payment`, `:core:notification`, `:core:analytics`, each hiding platform code behind `expect/actual`.
- Koin wiring, certificate pinning, force-update gate.

## Endpoints
Bootstrap, i18n and auth endpoints.

## Tables
None.

## Acceptance criteria
- [ ] No feature module depends on another feature module — enforced by a Gradle dependency test
- [ ] All platform APIs are reached only through a `core` module `expect/actual`
- [ ] Turning off the network still renders the app from cached bundles and data
- [ ] Token refresh under 20 concurrent 401s issues exactly one refresh call
- [ ] Adding a new RTL language in the CP flips the app layout with no release

## Out of scope
Screens.
