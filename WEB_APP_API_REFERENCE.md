# Groopin Web App API Reference (landing-vercel)

This document lists every API call the  web app makes, explains how to build the requests, and shows the response shapes the UI expects. It is based on:
- Frontend usage in `Groopin web app`
- Backend routes and resources in `BACKEND/groopin-backend`

If you change an endpoint, update this file and the affected screen.

## 1) Base URLs and auth

External API base (Groopin backend):
- `NEXT_PUBLIC_API_URL` (example: `https://tajrib.groopin.io/api`)

Internal API base (Next.js routes in this repo):
- `/api` (example: `/api/waitlist`)

Auth:
- Most backend endpoints require a Bearer token.
- The token is returned by `POST /login` and `POST /register` as `meta.token`.
- The web app stores the token in localStorage and sends `Authorization: Bearer <token>`.

## 2) Common headers

The web client (`app/lib/api-client.js`) sends:
- `Accept: application/json`
- `Accept-Language: <locale>` (ex: `en`, `fr`, `ar`)
- `Authorization: Bearer <token>` (if logged in)
- `Content-Type: application/json` when JSON body is present

Some endpoints use `fetch` directly (ex: `profile/avatar`) and also send `Authorization` and `Accept-Language` manually.

## 3) Common response shape and errors

Most endpoints return JSON with:
- `data`: the main payload
- `meta`: extra info (pagination, token, unread counts)

Errors:
- Validation errors often return `{ message, errors }` with HTTP 422.
- Some actions return HTTP 204 with no body.

## 4) Pagination

Cursor pagination (used by most list endpoints):
- Request: `?cursor=<cursor-token>`
- Response meta commonly includes `next_cursor`, `prev_cursor`, `path`, `per_page`.

Page pagination (used by some endpoints):
- Request: `?page=1&per_page=10`
- Response includes `links` or default Laravel pagination meta.

## 5) Lite mode (`?lite=1`)

Many list endpoints support `?lite=1` to return smaller payloads.
See `landing-vercel/API_LITE_CHANGES.md` for details.

## 6) Data models used by the web UI

### UserFull (UserResource)
Fields returned by backend `UserResource` (some may be hidden in specific endpoints):
- `id`, `first_name`, `last_name`, `name`, `email`
- `sex`, `date_of_birth`, `age`, `bio`
- `is_terms_accepted`, `is_verified`, `is_deleted`
- `locale`, `profile_completion`, `is_online`
- `avatar_image_url`, `uses_default_image`
- `average_rating`, `received_ratings_count`, `received_ratings`
- `dynamic_answers`, `resolved_dynamic_answers`
- `owning_offers`, `participated_offers`, `owning_offers_count`, `participated_offers_count`
- `pushtoken`, `signaled`, `blocked`

Note: `GET /users/{id}` hides some fields (email, locale, verified state).

### UserLite (used in lists)
Common subset used in list payloads:
- `id`, `first_name`, `last_name`, `name`
- `age`, `is_deleted`
- `avatar_image_url`, `uses_default_image`

### OfferLite (list cards)
Used by offers list, favorites, requests list, participating list, etc:
- `id`, `title`
- `start_date`, `start_time`, `end_date`, `end_time`
- `price`, `address`, `max_participants`
- `status`, `is_draft`, `is_closed`, `ticketing_enabled`
- `localized_status`
- `auth_user_is_participant`, `auth_user_is_pending_participant`, `auth_user_is_favorite`
- `average_rating`
- `participants_count`, `pending_participants_count`, `favorited_by_count`
- `city`: `{ id, name }`
- `category`: `{ id, name, background_image_url, parent: { background_image_url } }`
- `owner`: `{ id, first_name, last_name, age, is_deleted, avatar_image_url, uses_default_image }`
- `participants`: array of `{ id, first_name, last_name, avatar_image_url, uses_default_image }`

### OfferFull (OfferResource)
Used on detail screens:
- Attributes: `id`, `title`, `slug`, `start_date`, `start_time`, `end_date`, `end_time`, `start_at`, `end_at`, `price`, `address`, `max_participants`, `description`, `ticketing_enabled`, `submitted_at`, `approved_at`, `declined_at`, `created_at`, `updated_at`
- Status flags: `status`, `is_submitted`, `is_approved`, `is_active`, `is_pending`, `is_closed`, `is_draft`, `is_declined`
- Computed: `localized_status`, `average_rating`, `auth_user_is_participant`, `auth_user_is_pending_participant`, `auth_user_is_favorite`, `auth_user_rating`, `reported_by_auth_user`
- Relationships: `city`, `category`, `owner`, `participants`, `pending_participants`, `favorited_by`, `ratings`
- Counts: `participants_count`, `pending_participants_count`, `favorited_by_count`
- Dynamic answers: `dynamic_answers`, `resolved_dynamic_answers`

### OfferRequest
- `id`, `message`, `created_at`, `updated_at`
- `offer`: OfferLite or OfferFull depending on lite mode
- `user`: UserLite

### ConversationLite
- `id`, `offer_id`, `last_message_at`
- `unread_messages`, `has_unread_messages`, `has_unread_messages_count`
- `offer`: `{ id, title, participants_count, owner, participants }`
- `last_message`: `{ id, content, automatic, created_at, user }`

### MessageLite
- `id`, `content`, `type`, `automatic`, `created_at`
- `user`: UserLite
- `reply_to`: `{ id, content, type, user }` (optional)
- `reactions`: `[ { emoji, count } ]`
- `my_reaction`: `emoji` or null

### Notification
- `id`, `type`, `data`, `read_at`, `created_at`, `updated_at`

### Ticket
- `id`, `offer_id`, `user_id`, `status` (`active`, `checked_in`, `revoked`)
- `issued_at`, `checked_in_at`, `checked_in_by`, `scan_count`
- `token` (only when viewing your own ticket)
- `user`: UserLite

### Rating list
Returned by `GET /users/rates`:
- `offer`: OfferFull (with owner)
- `rates`: `[ { user: UserLite, rating: number, comment: string } ]`
- `links`: pagination info

### Parameters payload
Returned by `GET /parameters`:
- `categories`: CategoryResource (with children)
- `cities`: CityResource
- `locales`: array (ex: `["en","fr","ar"]`)
- `active_locale`: string
- `dynamic_questions`: `{ user: [...], offer: [...] }`
- `onboarding_screens`: array

CategoryResource:
- `id`, `name`, `slug`, `icon`, `is_longue_time`, `order_column`
- `background_image_url`
- `parent`, `children`

DynamicQuestionResource:
- `id`, `name`, `label`, `entity`, `type`, `purpose`, `formatted_settings`, `order_column`, `created_at`, `updated_at`

## 7) Query builder patterns

### Filter syntax (Spatie Query Builder)
Use `filter[...]` query parameters. Arrays are comma-separated strings.
Examples:
- `filter[category]=2,4` (categories)
- `filter[city]=1,5` (cities)
- `filter[start_date_between]=2025-01-01,2025-01-31`
- `filter[start_time_between]=08:00,14:00`
- `filter[participants_count_between]=2,8`
- `filter[budget_between]=50,200`
- `filter[age_between]=18,30`
- `filter[status]=active|draft|pending|published|closed|declined`
- `filter[sex]=male|female`
- `filter[marital_status]=<value>`
- `filter[interests]=<value>`
- `filter[isowner]=0|1` (participating list)

Example full query:
`GET /offers?filter[title]=hike&filter[category]=2,4&filter[city]=5&filter[start_date_between]=2025-01-01,2025-01-31&filter[start_time_between]=08:00,14:00&filter[participants_count_between]=2,8&filter[age_between]=18,30&lite=1`

## 8) Internal Next.js API routes (landing-vercel)

These are implemented inside `landing-vercel/app/api` and are called by the web UI.

### POST /api/waitlist
- Auth: no
- Body: `{ name, email }`
- Response:
  - `{ ok: true }` on success
  - `{ ok: true, duplicate: true }` when email already exists
  - `{ error: "..." }` on validation or server error
- Used in: landing waitlist form (if enabled)
- File: `landing-vercel/app/api/waitlist/route.js`

### GET /api/proxy-image?url=<encoded>
- Auth: no
- Query:
  - `url` must be `http` or `https`
- Response: proxied image stream
- Used in: `landing-vercel/app/app/auth/offers/[id]/page.jsx` for safe avatar images
- File: `landing-vercel/app/api/proxy-image/route.js`

## 9) Backend API used by the Web app (external)

### Auth and session

#### POST /login
- Auth: no
- Body: `{ email, password }`
- Response: `data: UserFull`, `meta: { token }`
- Used in: `landing-vercel/app/app/guest/login/page.jsx`

#### POST /register
- Auth: no
- Body: `{ first_name, last_name, email, sex, date_of_birth?, password, password_confirmation, is_terms_accepted }`
- Response: `data: UserFull`, `meta: { token }`
- Used in: `landing-vercel/app/app/guest/register/page.jsx`

#### GET /user
- Auth: yes
- Response: `data: UserFull`
- Used in:
  - `landing-vercel/components/app-shell.jsx`
  - `landing-vercel/app/app/auth/profile/edit/page.jsx`
  - `landing-vercel/app/app/auth/drawer/settings/account/page.jsx`
  - `landing-vercel/app/app/guest/social-callback/social-callback-client.jsx`

#### POST /logout
- Auth: yes
- Response: 204
- Used in:
  - `landing-vercel/components/app-shell.jsx`
  - `landing-vercel/app/app/auth/drawer/settings/account/page.jsx`
  - `landing-vercel/app/app/auth/otp-verify-email-verification/page.jsx`

#### POST /forgot-password
- Auth: no
- Body: `{ email }`
- Response: `{ status }`
- Used in:
  - `landing-vercel/app/app/guest/forgot-password/page.jsx`
  - `landing-vercel/app/app/guest/otp-forgot-password-verification/page.jsx` (resend)

#### POST /otp/verify
- Auth: no
- Body: `{ email, code }`
- Response (reset password flow): `{ message, endpoint, path, token }`
- Used in: `landing-vercel/app/app/guest/otp-forgot-password-verification/page.jsx`

#### POST /reset-password/{token}
- Auth: no
- Body: `{ email, password, password_confirmation }`
- Response: `{ status }`
- Used in: `landing-vercel/app/app/guest/reset-password/page.jsx`

#### POST /verify-email
- Auth: yes
- Body: `{ code }`
- Response: `{ message }`
- Used in: `landing-vercel/app/app/auth/otp-verify-email-verification/page.jsx`

#### POST /email/verification-notification
- Auth: yes
- Body: none
- Response: `{ status }`
- Used in: `landing-vercel/app/app/auth/otp-verify-email-verification/page.jsx`

#### GET /auth/{provider}/redirect
- Auth: no
- Query: `redirect_url` (optional, must be allowed host)
- Response: `{ redirect_url }`
- Used in: `landing-vercel/app/app/guest/login/page.jsx`

### Parameters

#### GET /parameters
- Auth: no
- Response: see Parameters payload above
- Used in:
  - `landing-vercel/app/app/auth/drawer/tabs/page.jsx`
  - `landing-vercel/app/app/auth/onboarding/page.jsx`
  - `landing-vercel/app/app/auth/my-offers/create/page.jsx`
  - `landing-vercel/app/app/auth/my-offers/[id]/page.jsx`
  - `landing-vercel/app/app/auth/offers/[id]/page.jsx`
  - `landing-vercel/app/app/auth/profile/edit/page.jsx`

### Offers (public list and detail)

#### GET /offers
- Auth: yes
- Query:
  - `lite=1` (recommended for lists)
  - `filter[...]` (see Filter syntax)
  - `no_cache=1` (optional, bypass cache)
- Response:
  - `lite=1`: `{ data: OfferLite[], meta: { next_cursor, prev_cursor, ... } }`
  - full: `{ data: OfferFull[], meta: { ... } }`
- Used in: `landing-vercel/app/app/auth/drawer/tabs/page.jsx`

#### GET /offers/{id}
- Auth: yes
- Response: `{ data: OfferFull }`
- Used in:
  - `landing-vercel/app/app/auth/offers/[id]/page.jsx`
  - `landing-vercel/app/app/auth/offers/[id]/participants/page.jsx`

#### POST /offers/{id}/favorite
#### DELETE /offers/{id}/favorite
- Auth: yes
- Body: none
- Response: 204
- Used in:
  - `landing-vercel/components/offers/offer-card.jsx`
  - `landing-vercel/app/app/auth/offers/[id]/page.jsx`

#### GET /offers/{id}/ticket
- Auth: yes
- Response: `{ data: Ticket }` (token only if ticket belongs to current user)
- Error cases:
  - 404 if no ticket
  - 410 if revoked
- Used in: `landing-vercel/app/app/auth/offers/[id]/page.jsx`

#### GET /offers/{id}/checkins?limit=15
- Auth: yes (owner only)
- Query: `limit` (1-50, default 20)
- Response: `{ data: Ticket[], meta: { count } }`
- Used in: `landing-vercel/app/app/auth/my-offers/[id]/page.jsx`

#### DELETE /offers/{id}/participants/{userId}
- Auth: yes (owner only)
- Response: 204
- Used in: `landing-vercel/app/app/auth/my-offers/[id]/participants/page.jsx`

#### POST /signal-offer
- Auth: yes
- Body: `{ offer_id, reason }`
- Response: `{ success: true, message, data: OfferSignalResource }`
- Used in: `landing-vercel/app/app/auth/offers/[id]/page.jsx`

### My offers (owner)

#### GET /my-offers
- Auth: yes
- Query: `filter[status]` and `lite=1`
- Response: OfferLite list or full list
- Used in:
  - `landing-vercel/app/app/auth/drawer/tabs/my-offers/page.jsx`
  - `landing-vercel/app/app/auth/drawer/tabs/profile/page.jsx`

#### GET /my-offers/{id}
- Auth: yes
- Response: `{ data: OfferFull }`
- Used in:
  - `landing-vercel/app/app/auth/my-offers/[id]/page.jsx`
  - `landing-vercel/app/app/auth/my-offers/[id]/participants/page.jsx`

#### POST /my-offers
- Auth: yes
- Body (create offer):
  - `title`, `category_id`, `start_date`, `start_time`, `end_date`, `end_time`, `city_id`
  - `price`, `address`, `max_participants`, `description`
  - `dynamic_questions` (object)
  - `save_as_draft` (boolean)
  - `ticketing_enabled` (boolean)
- Response: `{ data: OfferFull }`
- Used in: `landing-vercel/app/app/auth/my-offers/create/page.jsx`

#### PUT /my-offers/{id}
- Auth: yes
- Body: same as create (see UpdateOrStoreOfferRequest)
- Response: `{ data: OfferFull }`
- Used in: `landing-vercel/app/app/auth/my-offers/[id]/edit/page.jsx`

#### DELETE /my-offers/{id}
- Auth: yes
- Body: `{ reason? }`
- Response: 204
- Used in: `landing-vercel/app/app/auth/my-offers/[id]/page.jsx`

#### POST /my-offers/{id}/publish
- Auth: yes
- Body: none (server validates required fields)
- Response: 204
- Used in:
  - `landing-vercel/app/app/auth/my-offers/create/page.jsx`
  - `landing-vercel/app/app/auth/my-offers/[id]/page.jsx`

#### GET /my-offers/participated
- Auth: yes
- Query: `filter[status]` and `lite=1`
- Response: OfferLite list
- Used in: `landing-vercel/app/app/auth/drawer/tabs/requests/page.jsx`

### Participation requests

#### GET /requests
- Auth: yes
- Query: `lite=1`
- Response:
  - `lite=1`: `{ data: OfferRequest[], meta: {...} }` (each item has `offer` and `user`)
- Used in: `landing-vercel/app/app/auth/drawer/tabs/requests/page.jsx`

#### POST /requests/{offerId}
- Auth: yes
- Body: `{ message? }`
- Response: 204
- Used in:
  - `landing-vercel/components/offers/offer-card.jsx`
  - `landing-vercel/app/app/auth/offers/[id]/page.jsx`

#### DELETE /requests/{offerId}
- Auth: yes
- Response: 204
- Used in: `landing-vercel/app/app/auth/offers/[id]/page.jsx`

#### GET /offer-requests
- Auth: yes (owner)
- Query: `offer_id` (optional)
- Response: OfferRequestResource list (page-based)
- Used in:
  - `landing-vercel/app/app/auth/my-offers/[id]/page.jsx`
  - `landing-vercel/app/app/auth/my-offers/[id]/participants/page.jsx`

#### POST /offer-requests/{offerRequestId}/accept
- Auth: yes (owner)
- Response: 204
- Used in:
  - `landing-vercel/app/app/auth/my-offers/[id]/page.jsx`
  - `landing-vercel/app/app/auth/my-offers/[id]/participants/page.jsx`

#### DELETE /offer-requests/{offerRequestId}
- Auth: yes (owner)
- Response: 204
- Used in:
  - `landing-vercel/app/app/auth/my-offers/[id]/page.jsx`
  - `landing-vercel/app/app/auth/my-offers/[id]/participants/page.jsx`

### Participating offers

#### GET /participating
- Auth: yes
- Query: `filter[status]`, `filter[isowner]`, and `lite=1`
- Response: OfferLite list
- Used in:
  - `landing-vercel/app/app/auth/participating/page.jsx`
  - `landing-vercel/app/app/auth/drawer/tabs/profile/page.jsx`

#### DELETE /participating/{offerId}
- Auth: yes
- Response: 204
- Used in: `landing-vercel/app/app/auth/offers/[id]/page.jsx`

### Conversations and messages

#### GET /conversations
- Auth: yes
- Query: `lite=1`
- Response:
  - `lite=1`: `{ data: ConversationLite[], meta: { has_unread_messages, has_unread_messages_count, next_cursor, prev_cursor } }`
- Used in:
  - `landing-vercel/components/app-shell.jsx`
  - `landing-vercel/app/app/auth/drawer/tabs/groops/page.jsx`

#### GET /conversations/{id}/messages
- Auth: yes
- Query: `lite=1`
- Response (lite):
  - `data`: MessageLite[]
  - `meta.conversation`: minimal conversation info
  - `meta.read_states`: read state per participant
  - `meta.unread_messages`
- Used in: `landing-vercel/app/app/auth/conversations/[id]/page.jsx`

#### POST /conversations/{id}/messages
- Auth: yes
- Query: `lite=1`
- Body: `{ content, reply_to_message_id? }`
- Response: `data: MessageLite` (when lite)
- Used in: `landing-vercel/app/app/auth/conversations/[id]/page.jsx`

#### POST /conversations/{id}/typing
- Auth: yes
- Body: `{ is_typing: boolean }`
- Response: `{ data: { conversation_id, is_typing } }`
- Used in: `landing-vercel/app/app/auth/conversations/[id]/page.jsx`

#### POST /conversations/{id}/read
- Auth: yes
- Body: `{ message_id? }`
- Response: `{ data: { conversation_id, message_id, read_at } }`
- Used in: `landing-vercel/app/app/auth/conversations/[id]/page.jsx`

#### POST /conversations/{id}/messages/{messageId}/reactions
- Auth: yes
- Body: `{ emoji }`
- Response: `{ data: { conversation_id, message_id, emoji, action, reactions, my_reaction } }`
- Used in: `landing-vercel/app/app/auth/conversations/[id]/page.jsx`

### Notifications

#### GET /notifications
- Auth: yes
- Query: `lite=1`, `cursor=<token>`
- Response:
  - `data`: Notification[]
  - `meta`: `{ unread_count, total_count, next_cursor, prev_cursor }`
- Used in:
  - `landing-vercel/components/app-shell.jsx` (unread count)
  - `landing-vercel/app/app/auth/drawer/notifications/page.jsx`

#### PUT /notifications/{id}/mark-as-read
- Auth: yes
- Response: 204
- Used in: `landing-vercel/app/app/auth/drawer/notifications/page.jsx`

### Tickets and scanning

#### POST /tickets/scan
- Auth: yes (owner only)
- Body: `{ token, offer_id }`
- Response:
  - `ticket`: Ticket
  - `user`: `{ id, first_name, last_name, name, avatar_image_url }`
  - `offer`: `{ id, title }`
- Used in:
  - `landing-vercel/app/app/auth/offers/[id]/page.jsx`
  - `landing-vercel/app/app/auth/my-offers/[id]/page.jsx`

### Profile and users

#### GET /users/{id}
- Auth: yes
- Response: `{ data: UserFull }` (public profile, some fields hidden)
- Used in: `landing-vercel/app/app/auth/users/[id]/page.jsx`

#### POST /block-user
- Auth: yes
- Body: `{ user_id }`
- Response: `{ success: true, message }` (or 406 with `{ error, message }`)
- Used in: `landing-vercel/app/app/auth/users/[id]/page.jsx`

#### DELETE /block-user/{userId}
- Auth: yes
- Response: `{ success: true }`
- Used in:
  - `landing-vercel/app/app/auth/users/[id]/page.jsx`
  - `landing-vercel/app/app/auth/drawer/settings/page.jsx`

#### GET /blocked-users
- Auth: yes
- Response: UserResource[]
- Used in: `landing-vercel/app/app/auth/drawer/settings/page.jsx`

#### POST /signal-user
- Auth: yes
- Body: `{ user_id, reason, explanation? }`
- Response: `{ success: true, message, data: UserSignalResource }`
- Used in: `landing-vercel/app/app/auth/users/[id]/page.jsx`

#### PUT /profile/profile-information
- Auth: yes
- Body:
  - `first_name`, `last_name`, `sex`
  - `date_of_birth` (YYYY-MM-DD)
  - `bio`
  - `dynamic_questions` (object)
- Response: UserResource
- Used in: `landing-vercel/app/app/auth/profile/edit/page.jsx`

#### POST /profile/avatar
- Auth: yes
- Body: multipart form with field `avatar` (image, max 1024 KB)
- Response: UserResource
- Used in: `landing-vercel/app/app/auth/profile/edit/page.jsx`

#### PUT /profile/locale
- Auth: yes
- Body: `{ locale }`
- Response: UserResource
- Used in: `landing-vercel/app/app/auth/drawer/settings/page.jsx`

#### PUT /profile/password
- Auth: yes
- Body: `{ current_password, password, password_confirmation }`
- Response: 204
- Used in: `landing-vercel/app/app/auth/drawer/settings/account/page.jsx`

#### DELETE /user/delete
- Auth: yes
- Response: `{ data: UserResource }`
- Used in: `landing-vercel/app/app/auth/drawer/settings/account/page.jsx`

### Ratings

#### GET /users/rates
- Auth: yes
- Query: `offer_id` (required), `rater_id`, `ratee_id`, `page`, `per_page`
- Response: rating list payload (see Rating list above)
- Used in: `landing-vercel/app/app/auth/profile/offer-rating/[id]/page.jsx`

#### POST /users/rates
- Auth: yes
- Body: `{ rating, comment?, offer_id }`
- Response: 204
- Used in: `landing-vercel/app/app/auth/profile/offer-rating/[id]/page.jsx`

### Web push

#### POST /web-push/subscriptions
- Auth: yes
- Body: `{ endpoint, publicKey, authToken, contentEncoding? }`
- Response: `{ message: "Subscription stored." }`
- Used in: `landing-vercel/app/lib/web-push.js`

#### DELETE /web-push/subscriptions
- Auth: yes
- Body: `{ endpoint }`
- Response: `{ message: "Subscription deleted." }`
- Used in: `landing-vercel/app/lib/web-push.js`

---
