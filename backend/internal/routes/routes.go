package routes

import (
	"hairvlogs-api/internal/config"
	"hairvlogs-api/internal/handlers"
	"hairvlogs-api/internal/middleware"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Setup(app *fiber.App, db *gorm.DB, cfg *config.Config) {
	authHandler := handlers.NewAuthHandler(db, cfg)
	userHandler := handlers.NewUserHandler(db)
	haircutHandler := handlers.NewHaircutHandler(db)
	photoHandler := handlers.NewPhotoHandler(db)

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	api := app.Group("/api/v1")

	auth := api.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)

	protected := api.Group("", middleware.Protected(cfg.JWTSecret))

	users := protected.Group("/users")
	users.Get("/me", userHandler.Me)
	users.Put("/me", userHandler.UpdateMe)
	users.Delete("/me", userHandler.DeleteMe)

	haircuts := protected.Group("/haircuts")
	haircuts.Get("/", haircutHandler.List)
	haircuts.Post("/", haircutHandler.Create)
	haircuts.Get("/:id", haircutHandler.Get)
	haircuts.Put("/:id", haircutHandler.Update)
	haircuts.Delete("/:id", haircutHandler.Delete)

	haircuts.Get("/:haircutId/photos", photoHandler.List)
	haircuts.Post("/:haircutId/photos", photoHandler.Create)

	photos := protected.Group("/photos")
	photos.Get("/:id", photoHandler.Get)
	photos.Put("/:id", photoHandler.Update)
	photos.Delete("/:id", photoHandler.Delete)
	photos.Patch("/:id/cover", photoHandler.SetCover)
}
