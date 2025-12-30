# API Lite + Cache Notes (Dec 2025)

This document summarizes the performance work done for the Tajrib API and how
the web app now uses the lite endpoints.

## Why lite + cache
- **Lite endpoints** return only list-friendly fields (smaller payloads).
- **Cache layer** stores JSON responses per user + locale + query for 15-30s.
- Responses include `X-Cache` + `Server-Timing` to confirm HIT/MISS.

## Backend changes (overview)
- Added Redis-backed JSON caching for list endpoints via `App\Support\ApiCache`.
- Added `?lite=1` to list endpoints to reduce eager loads and payload size.
- Switched list + show endpoints to return direct JSON responses
  (bypass Laravel response builder overhead).

## Lite endpoints (supported)
These endpoints accept `?lite=1` and return reduced payloads:
- `/api/offers`
- `/api/offers/trashed`
- `/api/my-offers`
- `/api/my-offers/participated`
- `/api/offers/favorites`
- `/api/participating`
- `/api/requests`
- `/api/notifications`
- `/api/conversations`

### Output differences (lite vs full)
Common differences across lite endpoints:
- **Removed heavy relationships** (ratings, dynamic answers, large nested user
  relations, etc.)
- **Reduced user payload** (id, first/last name, avatar, age)
- **Kept list essentials** (counts, status flags, title, dates, category, city)

#### Offers list payload (lite)
Lite `offer` objects include:
- `id`, `title`, `start_date`, `start_time`, `end_date`, `end_time`
- `price`, `address`, `max_participants`
- `status`, `is_draft`, `is_closed`, `localized_status`
- `auth_user_is_participant`, `auth_user_is_pending_participant`,
  `auth_user_is_favorite`
- `participants_count`, `favorited_by_count`, `pending_participants_count`
- `city` (`id`, `name`)
- `category` (`id`, `name`, `background_image_url`, `parent.background_image_url`)
- `owner` (`id`, `first_name`, `last_name`, `age`, `is_deleted`,
  `avatar_image_url`, `uses_default_image`)
- `participants` (id, first_name, last_name, avatar_image_url, uses_default_image)

Full offers include additional relationships and computed fields (ratings,
dynamic answers, full participants/pending/favorites arrays, etc.).

#### Requests list payload (lite)
Lite `/api/requests` returns:
- `offer` with the same lite offer fields above
- `user` (id, first_name, last_name, avatar fields)
- No heavy offer relationships or ratings

Full `/api/requests` returns `OfferRequestResource` with `OfferResource`
including full offer relationships.

#### Conversations list payload (lite)
Lite `/api/conversations` returns:
- `offer` with `title`, `participants`, `owner`
- `last_message` (id, content, automatic, created_at, user basic fields)
- unread flags: `unread_messages`, `has_unread_messages`,
  `has_unread_messages_count`

Full `/api/conversations` returns the full resource + heavier relations.

#### Notifications list payload (lite)
Lite `/api/notifications` returns the same shape as full but uses cached JSON
and avoids heavy eager-loading.

## Frontend changes (landing-vercel)
The web app now uses `?lite=1` for list screens that only need list data.

Updated calls:
- App shell unread counts: `conversations?lite=1`
- Groops tab: `conversations?lite=1`
- My Offers tab: `my-offers?...&lite=1`
- Profile tab (history): `my-offers?filter[status]=closed&lite=1`,
  `participating?...&lite=1`
- Requests tab: `requests?lite=1`,
  `my-offers/participated?...&lite=1`

Endpoints still full (no lite implemented or full data required):
- Offer detail: `/api/offers/{id}`
- My offer detail: `/api/my-offers/{id}`
- Messages: `/api/conversations/{id}/messages`
- Tickets + checkins: `/api/tickets`, `/api/offers/{id}/ticket`,
  `/api/offers/{id}/checkins`, `/api/tickets/{id}/qr`
- User detail: `/api/users/{id}` and ratings endpoints

## How to verify
- Check `X-Cache` header for HIT/MISS.
- Compare `Server-Timing: app;dur=...` for lite vs full.
- Run list endpoints twice to confirm cache HIT.

