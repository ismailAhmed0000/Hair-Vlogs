package handlers

import (
	"errors"
	"strings"

	"hairvlogs-api/internal/config"
	"hairvlogs-api/internal/dto"
	"hairvlogs-api/internal/models"
	"hairvlogs-api/internal/utils"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type AuthHandler struct {
	DB  *gorm.DB
	Cfg *config.Config
}

func NewAuthHandler(db *gorm.DB, cfg *config.Config) *AuthHandler {
	return &AuthHandler{DB: db, Cfg: cfg}
}

func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var req dto.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body")
	}
	if err := utils.ValidateStruct(req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, err.Error())
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	var existing models.User
	if err := h.DB.Where("email = ?", req.Email).First(&existing).Error; err == nil {
		return utils.Error(c, fiber.StatusConflict, "email is already registered")
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to check existing user")
	}

	hash, err := utils.HashPassword(req.Password)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to hash password")
	}

	user := models.User{
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: hash,
	}
	if err := h.DB.Create(&user).Error; err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to create user")
	}

	token, err := utils.GenerateToken(user.ID, h.Cfg.JWTSecret, h.Cfg.JWTExpiry)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to generate token")
	}

	return utils.Success(c, fiber.StatusCreated, dto.AuthResponse{Token: token, User: user})
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req dto.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body")
	}
	if err := utils.ValidateStruct(req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, err.Error())
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	var user models.User
	if err := h.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		return utils.Error(c, fiber.StatusUnauthorized, "invalid email or password")
	}

	if !utils.CheckPassword(user.PasswordHash, req.Password) {
		return utils.Error(c, fiber.StatusUnauthorized, "invalid email or password")
	}

	token, err := utils.GenerateToken(user.ID, h.Cfg.JWTSecret, h.Cfg.JWTExpiry)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to generate token")
	}

	return utils.Success(c, fiber.StatusOK, dto.AuthResponse{Token: token, User: user})
}
