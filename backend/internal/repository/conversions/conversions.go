package conversions

import (
	"github.com/amiulam/text-to-speech/internal/models/conversions"
)

func (r *repository) GetAllTextToSpeech() ([]conversions.TextToSpeech, error) {
	conversionData := []conversions.TextToSpeech{}
	err := r.db.Model(&conversions.TextToSpeech{}).Order("created_at desc").Find(&conversionData).Error

	return conversionData, err
}

func (r *repository) CreateTextToSpeech(request conversions.TextToSpeech) (*conversions.TextToSpeech, error) {
	textToSpeech := request
	result := r.db.Create(&textToSpeech)
	if result.Error != nil {
		return nil, result.Error
	}

	return &textToSpeech, nil
}
