# Notification System

System for user management and multi-channel notifications

A FastAPI-based backend that handles user lifecycle (create, authenticate, reset password) and dispatches notifications through multiple channels (email, SMS, push). Authentication is JWT-based and persistence is backed by MySQL.

### Features

- User creation, listing, authentication, and password reset
- JWT-based authentication with Bearer tokens
- Multi-channel notification dispatch (email, SMS, push) using a Strategy-pattern channel abstraction
- Channel-aware validation (email format, numeric phone numbers)
- Soft-delete ready schema (`deleted_by` / `deleted_at` columns on every table)
- Containerized dev and test environments with MySQL 8
- Pytest suite with dependency overrides and a transactional DB session

### Author

Daniel Nahun Calcina Fuentes

- Github: https://github.com/DANIELNAHUN
- Website: https://daniel.calcina.dev
- Linkedin: https://www.linkedin.com/in/danielnahun/

## Table of contents

- [Technology](#technology)
- [Routes](#routes)
- [Pre Requisites](#pre-requisites)
- [Run app](#run-app)
- [Preconfigure Data](#preconfigure-data)
- [Run tests](#run-tests)
- [Standars applied](#standars-applied)
- [Deployment](#deployment)
- [Areas to improve](#areas-to-improve)

### Technology

- **Language**: Python 3.13 (see `.python-version`)
- **Framework**: FastAPI 0.136+ with `uvicorn` ASGI server
- **ORM**: SQLAlchemy 2.0+ with `pymysql` driver
- **Database**: MySQL 8.0
- **Auth**: JWT via `python-jose` (HS256), `HTTPBearer` security scheme
- **Password hashing**: `werkzeug.security` (PBKDF2-SHA256, 16-byte salt)
- **Config**: `python-dotenv` driven, env file selected by `APP_ENV`
- **Dependency manager**: `uv` (lockfile committed: `uv.lock`)
- **Tests**: `pytest` + `pytest-env`
- **Containers**: Docker + Docker Compose, two stacks (`dev` and `test`)

### Routes

Base prefix is `/api`. All routes are mounted in `main.py`.

| Method | Path                              | Auth required | Description                                                              |
| ------ | --------------------------------- | ------------- | ------------------------------------------------------------------------ |
| POST   | `/api/user/users`                 | Yes           | List all users                                                           |
| POST   | `/api/user/create_user`           | Yes           | Create a new user (records `created_by` from the authenticated user)     |
| POST   | `/api/user/login`                 | No            | Exchange credentials for a JWT access token                              |
| POST   | `/api/user/reset_password`        | No            | Reset a user's password and rotate the API token                        |
| GET    | `/api/notifications/channels`     | Yes           | List available notification channels (`email`, `sms`, `push`)            |
| POST   | `/api/notifications/notification` | Yes           | Send a notification through the requested channel                       |

Auth header format: `Authorization: Bearer <access_token>`.

#### Notification request body (`POST /api/notifications/notification`)

| Field              | Type   | Required | Notes                                                              |
| ------------------ | ------ | -------- | ------------------------------------------------------------------ |
| `sender_id`        | int    | Yes      | Sender user id                                                     |
| `receiver_id`      | int    | Yes      | Receiver user id (must exist)                                      |
| `subject`          | str    | Yes      | Notification subject                                               |
| `message`          | str    | Yes      | Notification body                                                  |
| `status`           | enum   | No       | `pending` (default), `sent`, `failed`                              |
| `created_at`       | date   | Yes      | Datetime of creation                                               |
| `sender_contact`   | str    | Cond.    | Required for `email`, `sms`, and `push`                            |
| `receiver_contact` | str    | Cond.    | Required for `email` (must be valid), `sms` and `push` (numeric)    |

### Pre Requisites

- Docker and Docker Compose
- `make` (the project ships a `Makefile`)

Nothing else is required on the host: dependencies and Python itself are installed inside the containers through `uv`.

### Run app

The default target is `make prod-up`, which builds and starts the dev stack (`docker-compose.yml`):

```bash
make prod-up
```

This brings up:

- `api`  -> FastAPI app on `http://localhost:8000`
- `db`   -> MySQL 8 on `localhost:3307` (database `not_system`)

Interactive API docs:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc:     `http://localhost:8000/redoc`

Useful targets:

```bash
make prod-logs     # tail logs
make prod-ps       # list containers
make prod-restart  # restart services
make prod-down     # stop and remove containers
make prod-build    # rebuild images
```

### Preconfigure Data

The dev container mounts `config/docker/init/` into MySQL's `docker-entrypoint-initdb.d`, so on first boot MySQL runs the SQL files in order:

- `001_schema_user.sql` -> creates the `user` table
- `002_seed_user.sql`   -> inserts a single seed user

Seed user from `config/docker/init/002_seed_user.sql`:

| user_name           | user_password | token        | is_active | created_by |
| ------------------- | ------------- | ------------ | --------- | ---------- |
| `admin@example.com` | `hashed_admin`| `token_admin`| 1         | 1          |

> Note: the seed `user_password` is stored as a literal string, not a real PBKDF2 hash. `check_password_hash` will therefore reject a login attempt against this user. To start using the system end-to-end, log in with a real account created through the API, or use the `reset_password` endpoint once a row is in place.

### Run tests

Tests live in `tests/` and run against a dedicated MySQL container (port `3307`) defined in `docker-compose.test.yml`. The Pytest configuration reads `.env.test` automatically (see `pyproject.toml` -> `tool.pytest.ini_options`).

Bring the test stack up and run the suite:

```bash
make test-up                              # start db_test (and any other test services)
pytest                                    # inside the host with the test DB reachable
```

The `tests/conftest.py` provides:

- `setup_database` (session scope): creates tables and loads seeds from `config/docker/init_test/002_seeds.sql`, drops everything on teardown
- `db_session` (function scope): real SQLAlchemy session wrapped in a transaction that is rolled back per test
- `mock_user` and `client`: override `get_db` and `get_current_user` for the FastAPI `TestClient`

Targets:

```bash
make test-up
make test-logs
make test-ps
make test-down
```

Test seed users (from `config/docker/init_test/002_seeds.sql`):

| user_name         | user_password  | token        |
| ----------------- | -------------- | ------------ |
| `admin@test.com`  | `hashed_admin` | `token_admin`|
| `user1@test.com`  | `hashed_user1` | `token_user1`|

### Standars applied

> TODO: no lint, format, or typecheck configuration is committed yet. The codebase mixes free-form prints with logging-style side effects, the imports trigger schema creation (see `Areas to improve`), and there is no `ruff` / `black` / `mypy` / `pre-commit` config. Decide on a baseline and wire it through CI.

Suggested baseline to add: `ruff` for lint + format, `mypy --strict` for types, `pre-commit` for the git hook, all wired into a CI workflow.

### Deployment

#### In Dev Mode

`docker-compose.yml` runs the full app:

- `api` service: `uvicorn main:app --reload --host 0.0.0.0 --port 8000`
- `db` service: MySQL 8.0, persistent volume `mysql_data`
- Timezone: `America/Lima`
- Healthcheck on the DB gates the API startup (`depends_on: condition: service_healthy`)
- The Frontend for the project is in the folder `client` in this repository. For initial development setup, you can run the following commands:
    1. `cd client && npm install` (this will install all the dependencies)
    2. then `npm run dev` (this will start the dev server)

#### In Test Mode

`docker-compose.test.yml` runs only the database:

- `db_test` service: MySQL 8.0 on host port `3307` (mapped to container `3306`)
- Persistent volume `mysql_test_data`
- Schema and seeds loaded from `config/docker/init_test/`
- No API container: the test suite drives FastAPI through `TestClient` in-process

## Areas to improve

- Add migrations (e.g. Alembic) — currently schemas are bootstrapped by `Base.metadata.create_all` called at import time inside `models/user.py` and `models/notifications.py`, which is a side effect on import and breaks the explicit "no SQL outside migrations" contract
- Python version mismatch: `pyproject.toml` requires `>=3.13` and `.python-version` is `3.13`, but the runtime image in `Dockerfile` is `python:3.12-slim-trixie`. Align them
- Remove the unused `from cryptography.fernet import Fernet` in `services/user_services.py:3` (and add `cryptography` to `pyproject.toml` only if it is actually needed)
- Seed user in dev cannot be used to log in (the stored `user_password` is a literal placeholder, not a PBKDF2 hash). Generate the first admin from a one-shot CLI or a startup script instead of inserting it via SQL
- `reset_password` route is unauthenticated — it should require the caller to be authenticated (or at least be tied to a recovery flow), and the `user.user_password = hashed_password,` line in `services/user_services.py:107` has a stray trailing comma that turns the assignment into a 1-tuple
- Wire `ruff`, `mypy`, and `pre-commit` (see "Standars applied")
- Add CI (lint + test matrix) and an `.env.example` (the repository only ships `.env` and `.env.test`, both gitignored)
- Add structured logging instead of `print(...)` calls scattered through `services/`
- Several routes are declared as `POST` but only read data (`/api/user/users`, `/api/user/login`, `/api/notifications/channels`) — switch to `GET` to follow REST conventions
- `routes/user.py:21`, `:34` and `routes/notifications.py:20`, `:28` declare `current_user` typed as `Session`; it is actually a `User` model
- Centralize the duplicated `get_db` function (defined in `config/bd.py`, `routes/user.py`, and `routes/notifications.py`)
- The frontend is not completely implemented, as it is a work in progress.

## Badges

[![CircleCI](https://dl.circleci.com/status-badge/img/circleci/SJRDsYNEpEj4K4DzFvUbqw/XF2i6kzBhZuZpeAQ4GH4hL/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/circleci/SJRDsYNEpEj4K4DzFvUbqw/XF2i6kzBhZuZpeAQ4GH4hL/tree/main)
[![Coverage Status](https://coveralls.io/repos/github/DANIELNAHUN/tch-notitication-rest/badge.svg?branch=main)](https://coveralls.io/github/DANIELNAHUN/tch-notitication-rest?branch=main)