package handlers

import (
	"errors"

	"hairvlogs-api/internal/dto"
	"hairvlogs-api/internal/middleware"
	"hairvlogs-api/internal/models"
	"hairvlogs-api/internal/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PhotoHandler struct {
	DB *gorm.DB
}

func NewPhotoHandler(db *gorm.DB) *PhotoHandler {
	return &PhotoHandler{DB: db}
}

func (h *PhotoHandler) ownsHaircut(userID, haircutID uuid.UUID) error {
	return h.DB.Select("id").First(&models.Haircut{}, "id = ? AND user_id = ?", haircutID, userID).Error
}

func (h *PhotoHandler) findOwnedPhoto(userID, photoID uuid.UUID) (*models.Photo, error) {
	var photo models.Photo
	err := h.DB.
		Joins("JOIN haircuts ON haircuts.id = photos.haircut_id").
		Where("photos.id = ? AND haircuts.user_id = ?", photoID, userID).
		First(&photo).Error
	if err != nil {
		return nil, err
	}
	return &photo, nil
}

func (h *PhotoHandler) List(c *fiber.Ctx) error {
	userID, _ := middleware.UserIDFromContext(c)

	haircutID, err := uuid.Parse(c.Params("haircutId"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid haircut id")
	}

	if err := h.ownsHaircut(userID, haircutID); err != nil {
		return utils.Error(c, fiber.StatusNotFound, "haircut not found")
	}

	var photos []models.Photo
	if err := h.DB.Where("haircut_id = ?", haircutID).Order("uploaded_at desc").Find(&photos).Error; err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch photos")
	}
	return utils.Success(c, fiber.StatusOK, photos)
}

func (h *PhotoHandler) Create(c *fiber.Ctx) error {
	userID, _ := middleware.UserIDFromContext(c)

	haircutID, err := uuid.Parse(c.Params("haircutId"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid haircut id")
	}

	if err := h.ownsHaircut(userID, haircutID); err != nil {
		return utils.Error(c, fiber.StatusNotFound, "haircut not found")
	}

	var req dto.CreatePhotoRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body")
	}
	if err := utils.ValidateStruct(req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, err.Error())
	}

	angle := models.AngleOther
	if req.Angle != "" {
		angle = models.PhotoAngle(req.Angle)
	}

	photo := models.Photo{
		HaircutID: haircutID,
		ImageURL:  req.ImageURL,
		Angle:     angle,
		IsCover:   req.IsCover,
	}

	err = h.DB.Transaction(func(tx *gorm.DB) error {
		if photo.IsCover {
			if err := tx.Model(&models.Photo{}).Where("haircut_id = ?", haircutID).Update("is_cover", false).Error; err != nil {
				return err
			}
		}
		return tx.Create(&photo).Error
	})
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to create photo")
	}

	return utils.Success(c, fiber.StatusCreated, photo)
}

func (h *PhotoHandler) Get(c *fiber.Ctx) error {
	userID, _ := middleware.UserIDFromContext(c)

	photoID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid photo id")
	}

	photo, err := h.findOwnedPhoto(userID, photoID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "photo not found")
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch photo")
	}

	return utils.Success(c, fiber.StatusOK, photo)
}

func (h *PhotoHandler) Update(c *fiber.Ctx) error {
	userID, _ := middleware.UserIDFromContext(c)

	photoID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid photo id")
	}

	var req dto.UpdatePhotoRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body")
	}
	if err := utils.ValidateStruct(req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, err.Error())
	}

	photo, err := h.findOwnedPhoto(userID, photoID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "photo not found")
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch photo")
	}

	if req.ImageURL != "" {
		photo.ImageURL = req.ImageURL
	}
	if req.Angle != "" {
		photo.Angle = models.PhotoAngle(req.Angle)
	}

	err = h.DB.Transaction(func(tx *gorm.DB) error {
		if req.IsCover != nil && *req.IsCover {
			if err := tx.Model(&models.Photo{}).Where("haircut_id = ?", photo.HaircutID).Update("is_cover", false).Error; err != nil {
				return err
			}
			photo.IsCover = true
		} else if req.IsCover != nil {
			photo.IsCover = *req.IsCover
		}
		return tx.Save(photo).Error
	})
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update photo")
	}

	return utils.Success(c, fiber.StatusOK, photo)
}

func (h *PhotoHandler) SetCover(c *fiber.Ctx) error {
	userID, _ := middleware.UserIDFromContext(c)

	photoID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid photo id")
	}

	photo, err := h.findOwnedPhoto(userID, photoID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "photo not found")
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch photo")
	}

	err = h.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&models.Photo{}).Where("haircut_id = ?", photo.HaircutID).Update("is_cover", false).Error; err != nil {
			return err
		}
		return tx.Model(&models.Photo{}).Where("id = ?", photo.ID).Update("is_cover", true).Error
	})
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to set cover photo")
	}

	photo.IsCover = true
	return utils.Success(c, fiber.StatusOK, photo)
}

func (h *PhotoHandler) Delete(c *fiber.Ctx) error {
	userID, _ := middleware.UserIDFromContext(c)

	photoID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid photo id")
	}

	photo, err := h.findOwnedPhoto(userID, photoID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "photo not found")
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch photo")
	}

	if err := h.DB.Delete(&models.Photo{}, "id = ?", photo.ID).Error; err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to delete photo")
	}

	return c.SendStatus(fiber.StatusNoContent)
}
