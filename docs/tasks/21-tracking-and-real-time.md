# 21 — Tracking and real-time

**Phase:** 4 Orders
**Depends on:** 20
**Spec:** `docs/README.md` §16.2, §19.5
**Contract:** `docs/openapi.yaml` tags `Tracking`, `Orders`

## Goal
Stream live position, status and chat over STOMP, with a polling fallback.

## Scope
- `POST /driver/location` accepting batches up to 100 points, deduplicated by `recordedAt`.
- Redis GEO for live position; downsampled writes to `driver_locations` for history and evidence.
- STOMP over WebSocket with the topic map from spec §16.2, authenticated by JWT on CONNECT and authorised per subscription.
- ETA calculation and route deviation distance, cached to limit Maps API cost.
- `GET /orders/{id}/tracking` polling fallback.
- `MapProvider` abstraction with a Google adapter and cached directions results.

## Endpoints
`POST /driver/location`, `GET /orders/{id}/tracking`, `GET /fleet/live-map`, `GET /admin/live-map`

## Tables
`driver_locations`, `orders`

## Acceptance criteria
- [ ] A client cannot subscribe to another order's location topic
- [ ] Replaying a buffered offline batch produces no duplicate rows
- [ ] Live position is served from Redis, not from MySQL, verified by a query-count assertion
- [ ] Directions results are cached and a repeated identical route makes no second external call
- [ ] Location payloads carry no personal identifiers beyond the driver id

## Out of scope
The map UI itself. Tasks 36 and 39.
