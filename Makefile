COMPOSE        := docker compose
COMPOSE_PROD   := $(COMPOSE) -f docker-compose.yml
COMPOSE_TEST   := $(COMPOSE) -f docker-compose.test.yml --env-file .env.test

.DEFAULT_GOAL := help

.PHONY: help
help:
	@echo "Available targets:"
	@echo "  make prod-up        Start production stack (docker-compose.yml)"
	@echo "  make prod-down      Stop production stack"
	@echo "  make prod-build     Build production images"
	@echo "  make prod-restart   Restart production services"
	@echo "  make prod-logs      Tail production logs"
	@echo "  make prod-ps        List production containers"
	@echo "  make test-up        Start test environment (docker-compose.test.yml + .env.test)"
	@echo "  make test-down      Stop test environment"
	@echo "  make test-build     Build test images"
	@echo "  make test-restart   Restart test services"
	@echo "  make test-logs      Tail test logs"
	@echo "  make test-ps        List test containers"
	@echo "  make test-run       Build and run tests in foreground (propagates pytest exit code)"

.PHONY: prod-up prod-down prod-build prod-restart prod-logs prod-ps
prod-up:
	$(COMPOSE_PROD) up -d --build

prod-down:
	$(COMPOSE_PROD) down

prod-build:
	$(COMPOSE_PROD) build

prod-restart:
	$(COMPOSE_PROD) restart

prod-logs:
	$(COMPOSE_PROD) logs -f

prod-ps:
	$(COMPOSE_PROD) ps

.PHONY: test-up test-down test-build test-restart test-logs test-ps test-run
test-up:
	$(COMPOSE_TEST) up -d --build

test-down:
	$(COMPOSE_TEST) down

test-build:
	$(COMPOSE_TEST) build

test-restart:
	$(COMPOSE_TEST) restart

test-logs:
	$(COMPOSE_TEST) logs -f

test-ps:
	$(COMPOSE_TEST) ps

test-run:
	$(COMPOSE_TEST) up --build --abort-on-container-exit api_test
