# 39 — Client mobile app

**Phase:** 8 Frontend
**Depends on:** 38, 17, 18, 21
**Spec:** `docs/README.md` §21.2
**Contract:** `docs/openapi.yaml` tags `Orders`, `Addresses`, `Chat`, `Money`

## Goal
The customer-facing app end to end.

## Scope
- Onboarding: language, phone, OTP, account type, profile, plan selection.
- Home, the seven-step order wizard with per-step autosave and the capacity guard, quote screen with expiry countdown, payment.
- Orders list and detail, live tracking with driver card, call and chat, share tracking link.
- Wallet, subscription, saved addresses, profile, notification preferences, sessions, support.

## Endpoints
All client-facing endpoints.

## Tables
None.

## Acceptance criteria
- [ ] Entering a weight above the selected truck capacity blocks the step and offers a bigger truck in one tap
- [ ] Killing the app mid-wizard restores the exact step and inputs
- [ ] An expired quote is re-fetched before payment rather than failing at the gateway
- [ ] Every string comes from the server bundle; a build check proves no hardcoded user-facing literal
- [ ] The app is usable in Arabic RTL and English LTR without layout defects

## Out of scope
Driver features.
