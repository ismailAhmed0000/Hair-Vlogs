package handlers

import (
	"fmt"
	"path/filepath"
	"strings"

	"hairvlogs-api/internal/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type UploadHandler struct {
	UploadsDir string
}

func NewUploadHandler(uploadsDir string) *UploadHandler {
	return &UploadHandler{UploadsDir: uploadsDir}
}

var allowedImageExtensions = map[string]bool{
	".jpg":  true,
	".jpeg": true,
	".png":  true,
	".heic": true,
	".webp": true,
}

func (h *UploadHandler) Create(c *fiber.Ctx) error {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "file is required")
	}

	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
	if !allowedImageExtensions[ext] {
		return utils.Error(c, fiber.StatusBadRequest, "unsupported file type")
	}

	filename := fmt.Sprintf("%s%s", uuid.NewString(), ext)
	dest := filepath.Join(h.UploadsDir, filename)

	if err := c.SaveFile(fileHeader, dest); err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to save file")
	}

	return utils.Success(c, fiber.StatusCreated, fiber.Map{
		"url": "/uploads/" + filename,
	})
}
