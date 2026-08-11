package handlers

import (
	"strings"

	"hairvlogs-api/internal/dto"
	"hairvlogs-api/internal/middleware"
	"hairvlogs-api/internal/models"
	"hairvlogs-api/internal/utils"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type UserHandler struct {
	DB *gorm.DB
}

func NewUserHandler(db *gorm.DB) *UserHandler {
	return &UserHandler{DB: db}
}

func (h *UserHandler) Me(c *fiber.Ctx) error {
	userID, _ := middleware.UserIDFromContext(c)

	var user models.User
	if err := h.DB.First(&user, "id = ?", userID).Error; err != nil {
		return utils.Error(c, fiber.StatusNotFound, "user not found")
	}
	return utils.Success(c, fiber.StatusOK, user)
}

func (h *UserHandler) UpdateMe(c *fiber.Ctx) error {
	userID, _ := middleware.UserIDFromContext(c)

	var req dto.UpdateUserRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body")
	}
	if err := utils.ValidateStruct(req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, err.Error())
	}

	var user models.User
	if err := h.DB.First(&user, "id = ?", userID).Error; err != nil {
		return utils.Error(c, fiber.StatusNotFound, "user not found")
	}

	if req.Name != "" {
		user.Name = req.Name
	}
	if req.Email != "" {
		email := strings.ToLower(strings.TrimSpace(req.Email))
		var existing models.User
		if err := h.DB.Where("email = ? AND id <> ?", email, userID).First(&existing).Error; err == nil {
			return utils.Error(c, fiber.StatusConflict, "email is already registered")
		}
		user.Email = email
	}

	if err := h.DB.Save(&user).Error; err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update user")
	}

	return utils.Success(c, fiber.StatusOK, user)
}

func (h *UserHandler) DeleteMe(c *fiber.Ctx) error {
	userID, _ := middleware.UserIDFromContext(c)

	if err := h.DB.Delete(&models.User{}, "id = ?", userID).Error; err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to delete user")
	}
	return c.SendStatus(fiber.StatusNoContent)
}
