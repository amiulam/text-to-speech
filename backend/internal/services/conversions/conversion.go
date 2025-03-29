package conversions

import (
	"github.com/amiulam/text-to-speech/internal/models/conversions"
)

func (s *service) SaveConversion(request conversions.ConversionRequest) (*conversions.TextToSpeech, error) {
	textToSpeechRequest := conversions.TextToSpeech{
		Text:      request.Text,
		VoiceName: request.VoiceName,
		Rate:      request.Rate,
		Pitch:     request.Pitch,
		Volume:    request.Volume,
	}

	model, err := s.conversionRepo.CreateTextToSpeech(textToSpeechRequest)
	if err != nil {
		return nil, err
	}

	return model, nil
}

func (s *service) GetConversions() ([]conversions.TextToSpeech, error) {
	result, err := s.conversionRepo.GetAllTextToSpeech()
	if err != nil {
		return nil, err
	}

	return result, nil
}
