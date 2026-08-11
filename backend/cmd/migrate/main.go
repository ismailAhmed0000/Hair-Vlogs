package main

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"

	"hairvlogs-api/internal/config"
	"hairvlogs-api/internal/migrations"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	_ "github.com/jackc/pgx/v5/stdlib"
)

func main() {
	if len(os.Args) < 2 {
		log.Fatal("usage: migrate <up|down|version|force> [args]")
	}

	cfg := config.Load()

	db, err := sql.Open("pgx", cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		log.Fatalf("failed to init postgres driver: %v", err)
	}

	source, err := iofs.New(migrations.FS, ".")
	if err != nil {
		log.Fatalf("failed to load migrations: %v", err)
	}

	m, err := migrate.NewWithInstance("iofs", source, "postgres", driver)
	if err != nil {
		log.Fatalf("failed to init migrator: %v", err)
	}

	switch os.Args[1] {
	case "up":
		runStep(m.Up())
	case "down":
		runStep(m.Steps(-1))
	case "version":
		v, dirty, err := m.Version()
		if err != nil {
			log.Fatalf("failed to read version: %v", err)
		}
		fmt.Printf("version=%d dirty=%v\n", v, dirty)
	case "force":
		if len(os.Args) < 3 {
			log.Fatal("usage: migrate force <version>")
		}
		var version int
		if _, err := fmt.Sscanf(os.Args[2], "%d", &version); err != nil {
			log.Fatalf("invalid version %q: %v", os.Args[2], err)
		}
		if err := m.Force(version); err != nil {
			log.Fatalf("failed to force version: %v", err)
		}
	default:
		log.Fatalf("unknown command %q", os.Args[1])
	}
}

func runStep(err error) {
	if err != nil && !errors.Is(err, migrate.ErrNoChange) {
		log.Fatalf("migration failed: %v", err)
	}
	fmt.Println("done")
}
