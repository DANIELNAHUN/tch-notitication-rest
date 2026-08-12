FROM python:3.12-slim-trixie
COPY --from=ghcr.io/astral-sh/uv:0.11.7 /uv /uvx /bin/

COPY . /app

RUN apt-get update && apt-get install -y --no-install-recommends

WORKDIR /app
ARG INSTALL_DEV=0
RUN if [ "$INSTALL_DEV" = "1" ]; then \
      uv sync --locked --group dev; \
    else \
      uv sync --locked; \
    fi