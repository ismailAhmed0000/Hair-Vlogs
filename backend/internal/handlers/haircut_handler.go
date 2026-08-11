package handlers

import (
	"errors"
	"time"

	"hairvlogs-api/internal/dto"
	"hairvlogs-api/internal/middleware"
	"hairvlogs-api/internal/models"
	"hairvlogs-api/internal/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

const dateLayout = "2006-01-02"

type HaircutHandler struct {
	DB *gorm.DB
}

func NewHaircutHandler(db *gorm.DB) *HaircutHandler {
	return &HaircutHandler{DB: db}
}

func (h *HaircutHandler) findOwnedHaircut(userID, haircutID uuid.UUID) (*models.Haircut, error) {
	var haircut models.Haircut
	err := h.DB.Preload("Photos").First(&haircut, "id = ? AND user_id = ?", haircutID, userID).Error
	if err != nil {
		return nil, err
	}
	return &haircut, nil
}

func (h *HaircutHandler) List(c *fiber.Ctx) error {
	userID, _ := middleware.UserIDFromContext(c)

	var haircuts []models.Haircut
	if err := h.DB.Preload("Photos").Where("user_id = ?", userID).Order("date_taken desc").Find(&haircuts).Error; err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch haircuts")
	}
	return utils.Success(c, fiber.StatusOK, haircuts)
}

func (h *HaircutHandler) Create(c *fiber.Ctx) error {
	userID, _ := middleware.UserIDFromContext(c)

	var req dto.CreateHaircutRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body")
	}
	if err := utils.ValidateStruct(req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, err.Error())
	}

	dateTaken, err := time.Parse(dateLayout, req.DateTaken)
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "date_taken must be in YYYY-MM-DD format")
	}

	haircut := models.Haircut{
		UserID:    userID,
		Title:     req.Title,
		DateTaken: dateTaken,
		Notes:     req.Notes,
	}
	if err := h.DB.Create(&haircut).Error; err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to create haircut")
	}

	return utils.Success(c, fiber.StatusCreated, haircut)
}

func (h *HaircutHandler) Get(c *fiber.Ctx) error {
	userID, _ := middleware.UserIDFromContext(c)

	haircutID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid haircut id")
	}

	haircut, err := h.findOwnedHaircut(userID, haircutID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "haircut not found")
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch haircut")
	}

	return utils.Success(c, fiber.StatusOK, haircut)
}

func (h *HaircutHandler) Update(c *fiber.Ctx) error {
	userID, _ := middleware.UserIDFromContext(c)

	haircutID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid haircut id")
	}

	var req dto.UpdateHaircutRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body")
	}
	if err := utils.ValidateStruct(req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, err.Error())
	}

	haircut, err := h.findOwnedHaircut(userID, haircutID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "haircut not found")
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch haircut")
	}

	if req.Title != "" {
		haircut.Title = req.Title
	}
	if req.DateTaken != "" {
		dateTaken, err := time.Parse(dateLayout, req.DateTaken)
		if err != nil {
			return utils.Error(c, fiber.StatusBadRequest, "date_taken must be in YYYY-MM-DD format")
		}
		haircut.DateTaken = dateTaken
	}
	if req.Notes != "" {
		haircut.Notes = req.Notes
	}

	if err := h.DB.Save(haircut).Error; err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update haircut")
	}

	return utils.Success(c, fiber.StatusOK, haircut)
}

func (h *HaircutHandler) Delete(c *fiber.Ctx) error {
	userID, _ := middleware.UserIDFromContext(c)

	haircutID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid haircut id")
	}

	result := h.DB.Where("id = ? AND user_id = ?", haircutID, userID).Delete(&models.Haircut{})
	if result.Error != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to delete haircut")
	}
	if result.RowsAffected == 0 {
		return utils.Error(c, fiber.StatusNotFound, "haircut not found")
	}

	return c.SendStatus(fiber.StatusNoContent)
}
