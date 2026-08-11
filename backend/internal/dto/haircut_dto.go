package dto

type CreateHaircutRequest struct {
	Title     string `json:"title" validate:"required,min=1,max=255"`
	DateTaken string `json:"date_taken" validate:"required,datetime=2006-01-02"`
	Notes     string `json:"notes" validate:"omitempty"`
}

type UpdateHaircutRequest struct {
	Title     string `json:"title" validate:"omitempty,min=1,max=255"`
	DateTaken string `json:"date_taken" validate:"omitempty,datetime=2006-01-02"`
	Notes     string `json:"notes" validate:"omitempty"`
}
