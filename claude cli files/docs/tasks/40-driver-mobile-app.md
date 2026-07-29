# 40 — Driver mobile app

**Phase:** 8 Frontend
**Depends on:** 38, 19, 20, 26
**Spec:** `docs/README.md` §21.3
**Contract:** `docs/openapi.yaml` tags `Driver`, `Money`, `Chat`

## Goal
The carrier-facing app end to end, offline-tolerant.

## Scope
- Onboarding: phone, OTP, application wizard with autosave, document capture, and the waiting, changes-requested, rejected and suspended states.
- Home with the online toggle, current order, earnings, counters, vehicle document status and SOS.
- Full-screen offer with countdown ring, accept and reject.
- Active trip with stage actions, navigation handoff, stop list, contacts, chat.
- Proof capture with a required-shot checklist, code entry, signature pad and an offline queue.
- Border document checklist and clearance status.
- Earnings, payout request, payout accounts, COD held and settlement submission.
- Compliance: violations, points, restrictions and appeal submission.

## Endpoints
All driver-facing endpoints.

## Tables
None.

## Acceptance criteria
- [ ] Proofs captured with no connectivity sync automatically on reconnect with no duplicates
- [ ] Foreground location survives the OS backgrounding the app during a trip
- [ ] The offer countdown matches the server expiry; accepting a stale offer surfaces `OFFER_TAKEN` gracefully
- [ ] Being blocked from going online shows the exact server reason key, not a generic error
- [ ] Battery drain over a two-hour trip stays within the agreed budget

## Out of scope
None.
