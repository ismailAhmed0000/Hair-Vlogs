package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PhotoAngle string

const (
	AngleFront PhotoAngle = "front"
	AngleSide  PhotoAngle = "side"
	AngleBack  PhotoAngle = "back"
	AngleOther PhotoAngle = "other"
)

func (a PhotoAngle) Valid() bool {
	switch a {
	case AngleFront, AngleSide, AngleBack, AngleOther:
		return true
	}
	return false
}

type Photo struct {
	ID         uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	HaircutID  uuid.UUID  `gorm:"type:uuid;not null;index" json:"haircut_id"`
	ImageURL   string     `gorm:"type:varchar(2048);not null" json:"image_url"`
	Angle      PhotoAngle `gorm:"type:varchar(10);not null;default:other" json:"angle"`
	IsCover    bool       `gorm:"not null;default:false" json:"is_cover"`
	UploadedAt time.Time  `gorm:"autoCreateTime" json:"uploaded_at"`
}

func (p *Photo) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}
