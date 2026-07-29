# 30 — In-app chat

**Phase:** 6 Trust
**Depends on:** 21
**Spec:** `docs/README.md` §16.1
**Contract:** `docs/openapi.yaml` tag `Chat`

## Goal
Order-scoped conversations with text, images and voice notes, retained permanently for disputes.

## Scope
- Conversation auto-created on assignment with client and driver as participants; support and admin can join any.
- Text, image and voice messages; media to MinIO with short-lived signed URLs.
- Delivery and read receipts, typing indicator over STOMP, offline queue with push fallback.
- Soft delete only: a deleted message stays visible to support with original content.
- Phone masking rules and a content-flagging hook that opens a support ticket.

## Endpoints
`GET /orders/{id}/chat`, `POST /orders/{id}/chat/messages`, `/media`, `/read`

## Tables
`conversations`, `conversation_participants`, `messages`

## Acceptance criteria
- [ ] No endpoint or job hard-deletes a message
- [ ] A non-participant cannot read or post, verified per role
- [ ] Media URLs expire and cannot be reused after expiry
- [ ] Voice notes above the configured duration are rejected
- [ ] `clientMessageId` deduplicates a retried send

## Out of scope
Moderation review UI. Task 36.
