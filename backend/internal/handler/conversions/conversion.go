package conversions

import (
	"net/http"

	"github.com/amiulam/text-to-speech/helpers"
	"github.com/amiulam/text-to-speech/internal/models/conversions"
	"github.com/gin-gonic/gin"
)

func (h *Handler) SaveConversion(c *gin.Context) {
	var request conversions.ConversionRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		helpers.SendResponseHTTP(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	result, err := h.conversionSvc.SaveConversion(request)

	if err != nil {
		helpers.SendResponseHTTP(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	helpers.SendResponseHTTP(c, http.StatusCreated, "success", result)
}

func (h *Handler) GetAllConversion(c *gin.Context) {
	result, err := h.conversionSvc.GetConversions()
	if err != nil {
		helpers.SendResponseHTTP(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	helpers.SendResponseHTTP(c, http.StatusOK, "success", result)
}
