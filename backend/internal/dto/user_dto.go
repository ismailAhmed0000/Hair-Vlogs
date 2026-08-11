package dto

type UpdateUserRequest struct {
	Name  string `json:"name" validate:"omitempty,min=2,max=255"`
	Email string `json:"email" validate:"omitempty,email"`
}
