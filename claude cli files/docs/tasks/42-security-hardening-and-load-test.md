# 42 — Security hardening and load test

**Phase:** 9 Release
**Depends on:** all
**Spec:** `docs/README.md` §23
**Contract:** `docs/openapi.yaml` none

## Goal
Prove the system holds up before real money and real trucks depend on it.

## Scope
- Full pass against spec §23: transport, auth, OTP, authorization, money, data, tracking links, input, audit, privacy.
- Automated checks: dependency scanning, secret scanning, least-privilege database users.
- Penetration test of authentication, tenant isolation, IDOR on every `{id}` path, webhook forgery and tracking-link enumeration.
- Load test: dispatch under concurrent accepts, location ingest at target driver count, chat fan-out, quote throughput.
- Data retention and deletion request handling.

## Endpoints
All.

## Tables
All.

## Acceptance criteria
- [ ] No critical or high finding remains open
- [ ] An IDOR test suite covers every path parameter and all attempts are rejected
- [ ] The system sustains the target concurrent drivers with p95 API latency inside budget
- [ ] Dispatch remains correct at 10x expected concurrency with zero double-assignments
- [ ] A data deletion request removes or anonymises the right rows and leaves the ledger intact

## Out of scope
None.
