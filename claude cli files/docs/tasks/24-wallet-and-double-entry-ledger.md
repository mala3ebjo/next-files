# 24 — Wallet and double-entry ledger

**Phase:** 5 Money
**Depends on:** 03, 04
**Spec:** `docs/README.md` §13.2
**Contract:** `docs/openapi.yaml` tag `Money`

## Goal
Build the money core that every other financial feature posts into.

## Scope
- `LedgerService.post(transactionRef, entries)` rejecting any unbalanced set atomically.
- Wallet balance and held balance derived from and reconciled against the ledger.
- Wallet endpoints and transaction history.
- A reconciliation job asserting wallet balances equal their ledger position, alerting on drift.

## Endpoints
`GET /wallet`, `GET /wallet/transactions`

## Tables
`wallets`, `wallet_transactions`, `ledger_accounts`, `ledger_entries`

## Acceptance criteria
- [ ] Posting an unbalanced transaction throws and writes nothing
- [ ] A property test over random valid transactions always leaves total debits equal to total credits
- [ ] Concurrent wallet updates are safe under optimistic locking
- [ ] The reconciliation job reports zero drift on seeded data

## Out of scope
Payout execution. Task 26.
