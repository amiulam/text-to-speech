package conversions

import (
	"github.com/amiulam/text-to-speech/internal/configs"
	"github.com/amiulam/text-to-speech/internal/models/conversions"
)

type repository interface {
	GetAllTextToSpeech() ([]conversions.TextToSpeech, error)
	CreateTextToSpeech(model conversions.TextToSpeech) (*conversions.TextToSpeech, error)
}

type service struct {
	cfg            *configs.Config
	conversionRepo repository
}

func NewService(cfg *configs.Config, conversionRepo repository) *service {
	return &service{
		cfg:            cfg,
		conversionRepo: conversionRepo,
	}
}
