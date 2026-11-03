# API reference

Base URL for local development: `http://localhost:3000` from the host computer, or the URL configured by `EXPO_PUBLIC_API_URL` from the mobile app.

Authenticated endpoints accept `Authorization: Bearer <token>`. Registration and login return `{ "user": { "id", "name", "email" }, "token" }`.

## Authentication

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | No | Create an account (`name`, `email`, `password`) |
| `POST` | `/auth/login` | No | Exchange email and password for a JWT |

## Reports

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/offenses/all` | No | List a bounded page of public reports, newest first |
| `GET` | `/offenses/mine` | Yes | List reports owned by the current account |
| `POST` | `/offenses` | Yes | Create a report |
| `PATCH` | `/offenses/:id` | Yes | Update a report owned by the current account |
| `DELETE` | `/offenses/:id` | Yes | Delete a report owned by the current account |

`POST /offenses` accepts `description` and an ISO 8601 `createdAt`; optional fields are `category`, `photoUrl`, `photoId`, `latitude`, and `longitude`. Categories are `traffic`, `vandalism`, `theft`, `noise`, `parking`, and `other`.

## Users

All user routes require authentication. A user can read and change only their own record, and the server returns a not-found response for an attempt to access another account.

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |

| `GET` | `/users/:id` | Yes | Read one user |
| `PATCH` | `/users/:id` | Yes | Update name or email |
| `DELETE` | `/users/:id` | Yes | Delete a user |

`GET /offenses/all` accepts `limit` (default 50, maximum 100) and an opaque `cursor` returned by the previous page. It responds with `{ "items": [...], "nextCursor": "..." }`; `nextCursor` is `null` on the last page. The mobile client fetches pages sequentially and keeps the existing in-app array behavior.

The unauthenticated report listing returns description, category, timestamp, and coordinates rounded to three decimal places. It omits stable user IDs and image URLs; consent and moderation are still needed before publishing real reports.
