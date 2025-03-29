package conversions

import (
	"github.com/amiulam/text-to-speech/internal/middleware"
	"github.com/amiulam/text-to-speech/internal/models/conversions"
	"github.com/gin-gonic/gin"
)

type service interface {
	SaveConversion(request conversions.ConversionRequest) (*conversions.TextToSpeech, error)
	GetConversions() ([]conversions.TextToSpeech, error)
}

type Handler struct {
	*gin.Engine
	conversionSvc service
}

func NewHandler(api *gin.Engine, conversionSvc service) *Handler {
	return &Handler{
		Engine:        api,
		conversionSvc: conversionSvc,
	}
}

func (h *Handler) RegisterRoute() {
	h.GET("conversions", middleware.AuthMiddleware(), h.GetAllConversion)
	h.POST("conversions", middleware.AuthMiddleware(), h.SaveConversion)
}
