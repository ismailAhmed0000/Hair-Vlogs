# Hair Vlogs API

Go Fiber + GORM backend for tracking haircuts and their reference photos over time.

## Stack

- [Fiber v2](https://gofiber.io/) - HTTP framework
- [GORM](https://gorm.io/) - ORM (PostgreSQL driver)
- JWT (golang-jwt/jwt) - authentication
- go-playground/validator - request validation
- OpenAPI 3.0 spec at [`docs/openapi.yaml`](docs/openapi.yaml), served with Swagger UI at `/docs`
- [golang-migrate](https://github.com/golang-migrate/migrate) - versioned SQL migrations (`internal/migrations`), run via `cmd/migrate`

## Data model

```
User 1───N Haircut 1───N Photo
```

- **User**: id (UUID), name, email (unique), password_hash, created_at
- **Haircut**: id (UUID), user_id (FK), title, date_taken, notes, created_at
- **Photo**: id (UUID), haircut_id (FK), image_url, angle (front/side/back/other), is_cover, uploaded_at

## Getting started

```bash
cp .env.example .env
# edit .env with your Postgres DSN and a real JWT_SECRET

make migrate-up
make run
```

API docs are available at `http://localhost:8080/docs` (raw spec at `/openapi.yaml`), and a health
check is at `/health`.

## Migrations

Schema is managed with versioned SQL files in [`internal/migrations`](internal/migrations), embedded
into the `cmd/migrate` binary at compile time and applied against `DATABASE_URL` from `.env`.

```bash
make migrate-up               # apply all pending migrations
make migrate-down             # roll back the most recent migration
make migrate-version          # print the current schema version
make migrate-force VERSION=2  # force the version marker (recovering from a dirty state)
```

To add a new migration, create a new `NNNNNN_description.up.sql` / `.down.sql` pair in
`internal/migrations` with the next sequence number.

## Auth

All endpoints except `/auth/register` and `/auth/login` require a bearer token:

```
Authorization: Bearer <token>
```

Obtain a token via register/login; it encodes the user id and expires per `JWT_EXPIRY_HOURS`.

## Endpoints

| Method | Path                          | Description                              |
|--------|-------------------------------|-------------------------------------------|
| POST   | /api/v1/auth/register         | Create an account, returns a token        |
| POST   | /api/v1/auth/login            | Login, returns a token                    |
| GET    | /api/v1/users/me              | Get current user profile                  |
| PUT    | /api/v1/users/me              | Update current user profile               |
| DELETE | /api/v1/users/me              | Delete current user (cascades)            |
| GET    | /api/v1/haircuts              | List current user's haircuts              |
| POST   | /api/v1/haircuts              | Create a haircut entry                    |
| GET    | /api/v1/haircuts/:id          | Get a haircut                             |
| PUT    | /api/v1/haircuts/:id          | Update a haircut                          |
| DELETE | /api/v1/haircuts/:id          | Delete a haircut (cascades to photos)     |
| GET    | /api/v1/haircuts/:id/photos   | List photos for a haircut                 |
| POST   | /api/v1/haircuts/:id/photos   | Add a photo to a haircut                  |
| GET    | /api/v1/photos/:id            | Get a photo                               |
| PUT    | /api/v1/photos/:id            | Update a photo                            |
| DELETE | /api/v1/photos/:id            | Delete a photo                            |
| PATCH  | /api/v1/photos/:id/cover      | Set photo as the haircut's cover thumbnail|

All haircut/photo access is scoped to the authenticated user — you can only see and modify your own data.
