package dto

type CreatePhotoRequest struct {
	ImageURL string `json:"image_url" validate:"required,url,max=2048"`
	Angle    string `json:"angle" validate:"omitempty,oneof=front side back other"`
	IsCover  bool   `json:"is_cover"`
}

type UpdatePhotoRequest struct {
	ImageURL string `json:"image_url" validate:"omitempty,url,max=2048"`
	Angle    string `json:"angle" validate:"omitempty,oneof=front side back other"`
	IsCover  *bool  `json:"is_cover"`
}
