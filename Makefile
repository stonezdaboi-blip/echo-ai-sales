.PHONY: help install dev test build docker-up docker-down deploy clean

help:
	@echo "ECHO - Autonomous AI Sales Intelligence"
	@echo ""
	@echo "Available commands:"
	@echo "  make install      - Install all dependencies"
	@echo "  make dev          - Start development servers"
	@echo "  make test         - Run all tests"
	@echo "  make build        - Build for production"
	@echo "  make docker-up    - Start Docker containers"
	@echo "  make docker-down  - Stop Docker containers"
	@echo "  make deploy       - Deploy to production"
	@echo "  make clean        - Clean build artifacts"

install:
	npm run install-all

dev:
	npm run dev

backend-dev:
	cd backend && npm run dev

mobile-dev:
	cd mobile && npm start

test:
	npm test

backend-test:
	cd backend && npm test

build:
	npm run build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f backend

deploy:
	npm run deploy

clean:
	rm -rf backend/dist mobile/.expo node_modules coverage

migrate:
	cd backend && npm run migrate

lint:
	cd backend && npm run lint || true
	cd mobile && npm run lint || true

format:
	cd backend && npm run format || true
	cd mobile && npm run format || true
