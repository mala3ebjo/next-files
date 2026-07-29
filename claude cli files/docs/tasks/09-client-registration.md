# 09 — Client registration

**Phase:** 1 Identity
**Depends on:** 07
**Spec:** `docs/README.md` §8, §19.3
**Contract:** `docs/openapi.yaml` tag `Registration`

## Goal
Individual and company clients sign up with phone + OTP and are active immediately.

## Scope
- `POST /registration/client` for both `INDIVIDUAL` and `COMPANY`.
- Company path creates an `organizations` row of type `CLIENT_COMPANY` plus a `COMPANY_ADMIN` membership.
- Optional plan selection; omitting it assigns the country's Free plan.
- Creates the client wallet in the country currency.

## Endpoints
`POST /registration/client`

## Tables
`users`, `client_profiles`, `organizations`, `organization_members`, `wallets`, `subscriptions`

## Acceptance criteria
- [ ] An individual client can create an order immediately after signup
- [ ] A company client gets an organisation, a `COMPANY_ADMIN` membership and a wallet
- [ ] Re-registering an existing phone returns 409 rather than creating a duplicate
- [ ] Terms acceptance is recorded with a timestamp

## Out of scope
Sub-user invitations for company clients.
