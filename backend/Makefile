.PHONY: run build tidy migrate-up migrate-down migrate-version migrate-force

run:
	go run ./cmd/api

build:
	go build -o bin/hairvlogs-api ./cmd/api

tidy:
	go mod tidy

migrate-up:
	go run ./cmd/migrate up

migrate-down:
	go run ./cmd/migrate down

migrate-version:
	go run ./cmd/migrate version

migrate-force:
	go run ./cmd/migrate force $(VERSION)
