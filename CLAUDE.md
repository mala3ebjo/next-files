# CLAUDE.md — NEXT Freight

Rules for any AI agent working in this repository. Read this fully before writing code.

**Full specification:** `docs/README.md` — the single source of truth. If this file and the spec disagree, the spec wins for *what* to build; this file wins for *how* to build it.

---

## 1. What this is

A truck freight marketplace for the Middle East. Clients request trucks, carriers deliver, the platform prices, dispatches, tracks, and settles money.

| Part | Stack |
|---|---|
| Backend | Java 21 + Spring Boot 3.x + MySQL 8 |
| Control Panel | React 18 + TypeScript + Vite |
| Mobile | Kotlin Multiplatform + Compose Multiplatform — 2 apps: Client, Driver |
| Infra | Docker Compose on VPS, Nginx, Cloudflare, Redis, MinIO |

Countries at launch are data, not code. Iraq is the first market. The system is multi-country, multi-currency, and multi-language from day one.

---

## 2. Repository layout

```
/
├── CLAUDE.md
├── docs/
│   ├── README.md              full specification
│   ├── openapi.yaml           API contract — SOURCE OF TRUTH for all clients
│   └── tasks/                 NN-task-name.md — one task per session
├── backend/
│   ├── app-bootstrap/
│   ├── common/{core,security,web,i18n}/
│   ├── modules/{identity,organization,catalog,pricing,order,dispatch,
│   │            tracking,payment,subscription,violation,chat,
│   │            notification,reporting,admin}/
│   ├── integrations/{payments-hyperpay,payments-zaincash,payments-cliq,
│   │                 maps-google,sms-provider,storage-s3}/
│   └── src/main/resources/db/migration/
├── control-panel/
├── mobile/
│   ├── core/{designsystem,icons,ui,model,common,network,api,database,
│   │         datastore,localization,location,maps,realtime,payment,
│   │         notification,analytics}/
│   ├── feature/{auth,profile,chat,tracking,wallet,ratings,notifications}/
│   ├── client/{order-create,orders,addresses,subscription}/
│   ├── driver/{availability,joboffers,proof,earnings,vehicle}/
│   └── apps/{client,driver}/
└── infra/
```

---

## 3. Golden rules — never break these

1. **Money is `BIGINT` minor units + a `currency_code` string.** Never `double`, never `float`. `BigDecimal` only inside pricing calculations, converted to long before storage.
2. **No user-facing text in code.** Backend returns `messageKey` + `params`. Clients render the translation. This applies to errors, notifications, statuses, and rejection reasons.
3. **Never trust a price from the client.** Prices are always computed server-side and stored as an immutable `price_quotes` snapshot.
4. **All timestamps are UTC** in the database and in the API. Convert to local time only for display.
5. **Every money-moving endpoint requires an `Idempotency-Key`** and writes double-entry rows to `ledger_entries`.
6. **No hardcoded country, currency, language, vehicle type, cargo type, fee, or threshold.** All of these are database rows managed from the control panel.
7. **Authorization is server-side only.** Never rely on the client hiding a button.
8. **Never edit a published Flyway migration.** Add a new one.
9. **Never log PII** — no phone numbers, no document contents, no tokens, no GPS coordinates tied to a person.
10. **The OpenAPI contract comes first.** Change `docs/openapi.yaml`, then implement. Mobile and CP types are generated from it.

---

## 4. Backend conventions

### Packages & layering

Root package: `com.nextfreight`

```
com.nextfreight.<module>/
├── api/          controllers, request/response DTOs, mappers
├── domain/       entities, enums, value objects, domain services
├── repository/   Spring Data repositories, custom queries
├── service/      application services, transactions, orchestration
├── event/        domain events, listeners
└── config/       module configuration
```

Rules:
- Controllers are thin: validate, delegate, map. No business logic.
- Entities never leave the service layer. Controllers speak DTOs only.
- Cross-module calls go through a public service interface in the other module — never through its repository or entity.
- Long transactions and external HTTP calls never mix. Call the gateway outside the transaction, then persist.

### Error handling

Single global `@RestControllerAdvice`. Every error returns:

```json
{
  "success": false,
  "error": { "code": "ORDER_WEIGHT_EXCEEDS_CAPACITY",
             "messageKey": "error.order.weight_exceeds",
             "params": { "max": 10000 } }
}
```

- `code` is a stable `SCREAMING_SNAKE_CASE` enum value. Never change one once released.
- Throw typed exceptions (`BusinessException`, `NotFoundException`, `ForbiddenException`), never raw `RuntimeException`.
- Never leak stack traces, SQL, or internal class names to the client.

### Success envelope

```json
{ "success": true, "data": { }, "meta": { "page": 1, "size": 20, "total": 134 } }
```

### Security

- Every controller method carries `@PreAuthorize("hasAuthority('permission.code')")`. No unannotated endpoint outside `/v1/config`, `/v1/i18n`, `/v1/auth`, `/v1/track`.
- Organization-scoped users are filtered by a Hibernate tenant filter. Never write a query that could return another organization's rows.
- Ownership checks are explicit: a client reads only their own orders, a driver only assigned orders.
- State transitions go through the order state machine. Never `order.setStatus(...)` directly.

### Persistence

- JPA for writes and simple reads. Native SQL or JOOQ for reports and aggregates — never `@OneToMany` fetch loops in reporting code.
- `@Version` optimistic locking on `orders`, `wallets`, `carrier_profiles`.
- No `CascadeType.REMOVE` anywhere. Deletion is explicit and audited.
- Soft delete via `deleted_at` on user-facing entities.

### Async & jobs

- Quartz for scheduled work (tier recalculation, violation scans, payout release, document expiry alerts).
- Jobs must be idempotent and safe to run twice.
- Long work is queued, never done inside a request thread.

---

## 5. Database conventions

- Migrations: `V<number>__<snake_case_description>.sql` in `backend/src/main/resources/db/migration/`.
- Seed data: `R__seed_<name>.sql` repeatable migrations for catalogs.
- Tables: plural snake_case (`order_stops`). Columns: snake_case. PK: `id BIGINT AUTO_INCREMENT`.
- Foreign keys: `<singular_table>_id`. Always declare the FK constraint.
- Every table has `created_at` and `updated_at`. User-facing tables also have `deleted_at`.
- Enums are stored as `VARCHAR` with a check on the application side, not MySQL `ENUM` — adding a value must not require a migration.
- Charset `utf8mb4`, collation `utf8mb4_0900_ai_ci`, engine InnoDB.
- Add the indexes listed in spec §18.7 in the same migration that creates the table.
- Live GPS goes to Redis. `driver_locations` stores only the historical trail.

---

## 6. API conventions

- Base path `/v1`. Breaking changes require `/v2`, never a silent change.
- Headers honoured on every request: `Authorization`, `Accept-Language`, `X-Country-Code`, `X-Device-Id`, `X-App-Version`.
- Pagination: `?page=&size=` with `meta.total`. Cursor pagination for chat and location history.
- Filtering uses explicit named query params only. Never accept a raw filter or sort expression from the client.
- Rate limits by endpoint class: OTP strictest, then writes, then reads.
- Webhooks verify the provider signature and are idempotent by `provider_ref`.

---

## 7. Mobile conventions (KMP)

- **Features never depend on other features.** Shared code moves down into `core/`.
- `:core:network` = Ktor engine, auth, retry, error mapping. `:core:api` = endpoints, DTOs, mappers. Keep them separate.
- Platform code (GPS, maps, camera, secure storage, payment SDK, biometrics) lives behind `expect/actual` inside its `core` module. Feature code stays pure `commonMain`.
- DI with Koin. Every module exposes one `Module` definition.
- No hardcoded user-facing strings. Everything comes from `:core:localization`.
- Layout direction comes from the language metadata (`direction` field). Never hardcode RTL.
- Money is formatted from currency metadata (symbol, decimal digits, position).
- Driver app is offline-first: status changes, proofs, and GPS batches queue in SQLDelight and sync with exponential backoff.
- Secrets in Keychain/Keystore. Certificate pinning on. No PII in logs.
- Compose: stateless composables + a `ViewModel` exposing a single `UiState`. No business logic in composables.

---

## 8. Control panel conventions

- API types are **generated** from `docs/openapi.yaml`. Never hand-write a response interface.
- Data fetching with TanStack Query. Local UI state with Zustand. No global store for server data.
- Every list screen: server-side pagination, filtering, and sorting. Never fetch all rows.
- Permission-gated rendering mirrors the backend permission codes, as a UX aid only — the backend is the real guard.
- i18n through i18next using the same server bundle endpoint as mobile. `dir` attribute set from language metadata.
- Forms use React Hook Form + Zod schemas mirroring backend validation.

---

## 9. Testing requirements

Non-negotiable for a task to be considered done:

| Layer | Required |
|---|---|
| Backend service | Unit tests for all business rules; edge cases for pricing, dispatch, ledger, violations |
| Backend API | Integration tests with Testcontainers (MySQL + Redis) for every endpoint |
| Money | A test proving debits equal credits for every ledger scenario |
| Pricing | Golden tests: fixed input → expected breakdown, including cross-border |
| State machine | A test asserting every illegal transition is rejected |
| Mobile | `commonTest` unit tests for use cases and mappers |
| CP | Component tests for forms and tables |

Coverage target: 80% on `service/` and `domain/` packages. Controllers may be lower if integration-tested.

---

## 10. Commands

```bash
# Backend
./gradlew :backend:build
./gradlew :backend:test
./gradlew :backend:app-bootstrap:bootRun
./gradlew flywayMigrate
./gradlew spotlessApply          # formatting — run before every commit

# Control panel
cd control-panel && npm run dev
npm run build
npm run test
npm run generate:api             # regenerate types from docs/openapi.yaml

# Mobile
./gradlew :mobile:apps:client:androidApp:assembleDebug
./gradlew :mobile:apps:driver:androidApp:assembleDebug
./gradlew :mobile:allTests

# Local infra
docker compose -f infra/docker-compose.dev.yml up -d
```

---

## 11. Git conventions

- Branches: `feat/<task-number>-<short-name>`, `fix/…`, `chore/…`
- Commits: Conventional Commits — `feat(pricing): add corridor fee resolution`
- One task file = one branch = one PR.
- Never commit: secrets, `.env`, keystores, service account JSON, real customer data.

---

## 12. How to work on a task

1. Read `docs/tasks/NN-*.md` and the referenced spec sections. Do **not** read the whole spec.
2. State a short plan before writing code. List the files you will create or change.
3. If the task needs an API change, update `docs/openapi.yaml` first.
4. If it needs a schema change, write the Flyway migration first.
5. Implement, then write the tests, then run them.
6. Run `spotlessApply` and the full module test suite.
7. Report: what changed, what was assumed, what is still open.

**Stop and ask instead of guessing when:** the spec is silent on a business rule, a money or commission calculation is ambiguous, a security decision is involved, or the task would require changing an already-published API contract or migration.

---

## 13. Definition of done

- [ ] Behaviour matches the spec section referenced by the task
- [ ] `docs/openapi.yaml` updated and clients regenerate cleanly
- [ ] Flyway migration added, applies on a clean database, and is not an edit of an existing file
- [ ] All permissions annotated; organization scoping verified
- [ ] All user-facing text is a translation key, added to the seed translations
- [ ] Money paths write balanced ledger entries and accept an idempotency key
- [ ] Tests written and passing; coverage target met
- [ ] `spotlessApply` / lint clean
- [ ] No secrets, no PII in logs, no `TODO` left in committed code

---

## 14. Anti-patterns — reject these on sight

| Do not | Do instead |
|---|---|
| `double amount` | `long amountMinor` + `String currencyCode` |
| `throw new RuntimeException("Order not found")` | `throw new NotFoundException("ORDER_NOT_FOUND", "error.order.not_found")` |
| `if (countryCode.equals("IQ"))` | look up the country row and its configuration |
| `order.setStatus(DELIVERED)` | `orderStateMachine.transition(order, DELIVER, context)` |
| `return "Payment failed"` | `messageKey: "error.payment.failed"` |
| Repository called from a controller | controller → service → repository |
| Entity returned from a controller | map to a DTO |
| A new `@RestControllerAdvice` | extend the existing global handler |
| Hand-written CP API types | `npm run generate:api` |
| A feature module importing another feature module | move shared code into `core/` |
| `SELECT *` in a report query | explicit columns, explicit index |
| Editing `V3__add_orders.sql` after merge | add `V17__alter_orders.sql` |
