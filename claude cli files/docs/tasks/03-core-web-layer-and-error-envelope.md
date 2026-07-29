# 03 — Core web layer and error envelope

**Phase:** 0 Foundation
**Depends on:** 01
**Spec:** `docs/README.md` §19.10, CLAUDE.md §4
**Contract:** `docs/openapi.yaml` none

## Goal
Establish the response envelope, the typed exception hierarchy and the global handler so no later task invents its own error format.

## Scope
- `ApiResponse<T>`, `PageMeta`, `ApiError` matching the OpenAPI `BaseResponse` / `ErrorResponse` schemas exactly.
- Typed exceptions: `BusinessException(code, messageKey, params)`, `NotFoundException`, `ForbiddenException`, `InvalidStateException`, `ConflictException`.
- One `@RestControllerAdvice` mapping exceptions, bean-validation failures and Spring errors into the envelope with `fieldErrors`.
- `Money` value type: `long amountMinor` + `String currencyCode`, arithmetic helpers, JSON serialiser. No `double` anywhere.
- Request correlation id filter; structured JSON logging with no PII.
- `Idempotency-Key` interceptor backed by the `idempotency_keys` table: replaying a key returns the stored response.

## Endpoints
None directly. Applies to every endpoint.

## Tables
`idempotency_keys`

## Acceptance criteria
- [ ] Every error response contains `code` + `messageKey`, never a translated sentence
- [ ] Validation failure returns 400 with a populated `fieldErrors` array
- [ ] Replaying an `Idempotency-Key` returns the original status and body without re-executing
- [ ] `Money` rejects mixing currencies in arithmetic
- [ ] Unit tests cover every exception type mapping

## Out of scope
Authentication. That is task 07.
