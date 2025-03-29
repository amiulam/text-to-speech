package conversions

import (
	"time"

	"gorm.io/gorm"
)

type BaseModel struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

type TextToSpeech struct {
	BaseModel
	Text      string  `gorm:"not null" json:"text"`
	VoiceName string  `gorm:"not null" json:"voice_name"`
	Rate      float32 `gorm:"not null" json:"rate"`
	Pitch     float32 `gorm:"not null" json:"pitch"`
	Volume    float32 `gorm:"not null" json:"volume"`
}

type (
	ConversionRequest struct {
		Text      string  `json:"text"`
		VoiceName string  `json:"voice_name"`
		Rate      float32 `json:"rate"`
		Pitch     float32 `json:"pitch"`
		Volume    float32 `json:"volume"`
	}
)
