# 10 — Carrier applications

**Phase:** 1 Identity
**Depends on:** 07
**Spec:** `docs/README.md` §8, §19.3
**Contract:** `docs/openapi.yaml` tag `Registration`

## Goal
Individual drivers, fleets and brokers submit multi-step applications with documents and wait for admin approval.

## Scope
- Three creation endpoints, one per carrier type, each starting a `carrier_applications` row in `DRAFT`.
- `PATCH /registration/{id}/step/{n}` auto-saving each wizard step into `payload` so an interrupted applicant resumes exactly where they stopped.
- Document upload to MinIO via `StorageProvider` with magic-byte type checking, size limit and antivirus hook.
- `POST /registration/{id}/submit` validating that every mandatory field and document for that carrier type is present.
- Duplicate detection at submit time: same plate, licence number, national id or phone already in the system, written to `duplicate_warnings`.
- Phone verified by OTP at submit, which grants no access until approval.

## Endpoints
`POST /registration/carrier/driver`, `/fleet`, `/broker`, `PATCH /registration/{id}/step/{n}`, `POST /registration/{id}/documents`, `POST /registration/{id}/submit`, `GET /registration/{id}/status`

## Tables
`carrier_applications`, `documents`

## Acceptance criteria
- [ ] Killing the app mid-wizard and reopening restores the exact step and data
- [ ] Submitting with a missing mandatory document returns 400 listing the missing `docType` values
- [ ] A duplicate plate produces a warning row without blocking submission
- [ ] A LIMITED token can reach only the registration and status endpoints, verified per endpoint
- [ ] Uploading a renamed executable is rejected on magic bytes, not extension

## Out of scope
Admin review. Task 11.
