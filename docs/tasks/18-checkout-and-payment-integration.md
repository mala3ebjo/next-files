# 18 — Checkout and payment integration

**Phase:** 4 Orders
**Depends on:** 17, 24
**Spec:** `docs/README.md` §13.1, §19.4
**Contract:** `docs/openapi.yaml` tags `Orders`, `Money`

## Goal
Take payment before an order enters dispatch, behind a swappable gateway abstraction.

## Scope
- `PaymentProvider` interface: initiate, capture, refund, parse webhook. HyperPay adapter first; a sandbox adapter for tests.
- `POST /orders/{id}/checkout` validating quote freshness and that the method is allowed in the pickup country.
- Card, wallet and COD paths. COD only when enabled for the country.
- Webhook endpoint with signature verification and idempotency by `provider_ref`; never trusts the payload amount.
- On authorisation, post escrow ledger entries and move the order to `SEARCHING`.
- Payment failure and retry handling.

## Endpoints
`POST /orders/{id}/checkout`, `POST /webhooks/payments/{provider}`, `POST /wallet/topup`

## Tables
`payments`, `payment_events`, `ledger_entries`, `wallets`, `orders`

## Acceptance criteria
- [ ] A duplicate webhook is processed exactly once
- [ ] An invalid signature returns 401 and writes an unprocessed `payment_events` row
- [ ] Successful payment produces balanced escrow ledger entries
- [ ] Selecting COD in a country where it is disabled returns 422 `PAYMENT_METHOD_NOT_ALLOWED`
- [ ] No order reaches `SEARCHING` before payment is authorised or COD is confirmed
- [ ] Concurrent checkout calls with the same `Idempotency-Key` create one payment

## Out of scope
Payout of the funds. Task 26.
