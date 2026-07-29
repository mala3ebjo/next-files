# 27 — Client subscriptions

**Phase:** 5 Money
**Depends on:** 18, 24
**Spec:** `docs/README.md` §14.1
**Contract:** `docs/openapi.yaml` tag `Money`

## Goal
Sell paid plans and enforce every benefit as a CP-editable toggle.

## Scope
- Plan and benefit CRUD per country.
- Subscribe, renew, cancel, dunning retries and automatic downgrade to Free on failure.
- `BenefitService`: the single place any code reads a plan benefit. Used by pricing discount, free cancellations, dispatch priority, address limit, max stops, sub-users, postpaid credit.
- Postpaid invoicing and credit limit for Business.

## Endpoints
`GET /subscriptions/plans`, `GET/POST /subscriptions`, `POST /subscriptions/cancel`, `GET/POST /admin/subscription-plans`, `PATCH /admin/subscription-plans/{id}`

## Tables
`subscription_plans`, `plan_benefits`, `subscriptions`, `subscription_invoices`, `payments`

## Acceptance criteria
- [ ] Turning a benefit off in the CP changes behaviour on the next request with no deploy
- [ ] A failed renewal enters dunning and downgrades to Free after the configured attempts
- [ ] The UNLIMITED value type is handled everywhere a numeric limit is read
- [ ] `BenefitService` is the only reader of `plan_benefits` — ArchUnit test

## Out of scope
None.
