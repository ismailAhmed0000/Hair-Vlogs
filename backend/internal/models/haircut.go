package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Haircut struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null;index" json:"user_id"`
	Title     string    `gorm:"type:varchar(255);not null" json:"title"`
	DateTaken time.Time `gorm:"type:date;not null" json:"date_taken"`
	Notes     string    `gorm:"type:text" json:"notes"`
	CreatedAt time.Time `json:"created_at"`

	Photos []Photo `gorm:"foreignKey:HaircutID;constraint:OnDelete:CASCADE" json:"photos,omitempty"`
}

func (h *Haircut) BeforeCreate(tx *gorm.DB) error {
	if h.ID == uuid.Nil {
		h.ID = uuid.New()
	}
	return nil
}
