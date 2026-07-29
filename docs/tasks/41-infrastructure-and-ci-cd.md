# 41 — Infrastructure and CI/CD

**Phase:** 9 Release
**Depends on:** 01
**Spec:** `docs/README.md` §22
**Contract:** `docs/openapi.yaml` none

## Goal
Ship it repeatedly and safely.

## Scope
- Docker Compose stack for staging and production: Nginx, two API replicas, MySQL primary and replica, Redis, MinIO, Prometheus, Grafana, Loki.
- Cloudflare: DNS, TLS, WAF, DDoS, bot protection on OTP and tracking endpoints, static and media caching.
- GitHub Actions: build, test, OpenAPI drift check, image push, SSH deploy, Flyway migrate, health check, automatic rollback.
- Mobile CI: Android AAB and iOS IPA to Firebase App Distribution, then Fastlane store lanes.
- Nightly encrypted backups off-site with a documented and rehearsed restore.
- Grafana dashboards: orders per minute, time-to-assign, payment success rate, WebSocket connections, error rate. Alertmanager routing.

## Endpoints
None.

## Tables
None.

## Acceptance criteria
- [ ] A deploy completes with zero dropped requests
- [ ] A failed health check rolls back automatically
- [ ] A restore drill reproduces the database from backup within the agreed RTO
- [ ] Secrets exist only outside the repository and rotation is documented
- [ ] Alerts fire to the on-call channel in a simulated outage

## Out of scope
Kubernetes.
